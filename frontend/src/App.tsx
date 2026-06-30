import { useEffect, useMemo, useState } from 'react';
import type { AiFeedback, Topic, TranslationApiResult, Vocabulary } from './types/dayline';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import TopicRecommendationSection from './components/TopicRecommendationSection';
import DiaryEditor from './components/DiaryEditor';
import QuickTranslateBox from './components/QuickTranslateBox';
import FeedbackSection from './components/FeedbackSection';
import { formatDateLabel, todayDate, topics } from './data/daylineMock';

type RecommendVocabulary = {
  word?: string;
  meaning?: string;
  pron?: string;
};

type RecommendTopic = {
  topic?: string;
  vocabularies?: RecommendVocabulary[];
};

type RecommendResponse = {
  topics?: RecommendTopic[];
};

type FeedbackRequest = {
  targetLanguage: string;
  diary: string;
};

type DiarySaveRequest = {
  id: number | null;
  targetLanguage: string;
  diaryDate: string;
  content: string;
};

type DiarySelectRequest = {
  targetLanguage: string;
  diaryDate: string;
};

type DiaryResponse = {
  id: number | null;
  targetLanguage: string;
  diaryDate: string;
  content: string | null;
};

const readJwtSubject = (token: string): number | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const parsedPayload = JSON.parse(window.atob(normalizedPayload)) as { sub?: string };
    const userId = Number(parsedPayload.sub);

    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
};

const readJwtName = (token: string): string | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const parsedPayload = JSON.parse(window.atob(normalizedPayload)) as { name?: string; email?: string };

    return parsedPayload.name ?? parsedPayload.email ?? null;
  } catch {
    return null;
  }
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [topicList, setTopicList] = useState<Topic[]>(topics);
  const [diary, setDiary] = useState<string>('');
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>('english');
  const [diaryId, setDiaryId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('daylineToken'));
  const [userId, setUserId] = useState<number | null>(() => {
    const savedToken = localStorage.getItem('daylineToken');
    return savedToken ? readJwtSubject(savedToken) : null;
  });
  const [userName, setUserName] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('daylineToken');
    return savedToken ? readJwtName(savedToken) : null;
  });
  const [isDiarySaving, setIsDiarySaving] = useState<boolean>(false);
  const [diarySaveMessage, setDiarySaveMessage] = useState<string | null>(null);

  const quickDateText = useMemo(() => formatDateLabel(selectedDate), [selectedDate]);
  const isLoggedIn = Boolean(userId && authToken);

  const handleLookup = async (query: string): Promise<TranslationApiResult> => {
    if (!authToken) {
      throw new Error('Login is required.');
    }

    const response = await fetch('http://localhost:8080/translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        text: query,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch translation: ${response.status}`);
    }

    return (await response.json()) as TranslationApiResult;
  };

  const fetchRecommendation = async (language = targetLanguage) => {
    if (!authToken) return;

    try {
      const response = await fetch(
        `http://localhost:8080/topics/recommend?targetLanguage=${encodeURIComponent(language)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch topics: ${response.status}`);
      }

      const data = (await response.json()) as RecommendResponse;
      const nextTopics =
        data.topics?.map((item, index): Topic => ({
          id: `${item.topic ?? 'topic'}-${index}`,
          title: item.topic ?? `Topic ${index + 1}`,
          description: '',
          words: (item.vocabularies ?? [])
            .map((vocabulary): Vocabulary | null => {
              if (!vocabulary?.word) return null;
              return {
                word: vocabulary.word,
                meaning: vocabulary.meaning ?? '',
                pron: vocabulary.pron,
              };
            })
            .filter((v): v is Vocabulary => Boolean(v && v.word)),
          vibe: 'AI',
        })) ?? [];

      if (nextTopics.length > 0) {
        setTopicList(nextTopics);
      }
    } catch (error) {
      console.error('fetchRecommendation failed', error);
      throw error;
    }
  };

  const fetchDiary = async (language: string, date: string) => {
    if (!authToken) return;

    const payload: DiarySelectRequest = {
      targetLanguage: language,
      diaryDate: date,
    };

    try {
      const response = await fetch('http://localhost:8080/dayline/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch diary: ${response.status}`);
      }

      const data = (await response.json()) as DiaryResponse;
      setDiaryId(data.id);
      setDiary(data.content ?? '');
      setDiarySaveMessage(null);
      setFeedback(null);
      setFeedbackError(null);
    } catch (error) {
      console.error('fetchDiary failed', error);
      setDiaryId(null);
      setDiary('');
      setDiarySaveMessage('일기를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleRequestFeedback = async () => {
    const payload: FeedbackRequest = {
      targetLanguage,
      diary: diary.trim(),
    };

    if (!payload.diary) {
      setFeedback(null);
      setFeedbackError('일기를 먼저 작성한 뒤 피드백을 요청해 주세요.');
      return;
    }

    setIsFeedbackLoading(true);
    setFeedbackError(null);

    try {
      const response = await fetch('http://localhost:8080/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feedback: ${response.status}`);
      }

      const data = (await response.json()) as AiFeedback;
      setFeedback(data);
    } catch (error) {
      console.error('handleRequestFeedback failed', error);
      setFeedback(null);
      setFeedbackError('AI 피드백을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleSaveDiary = async () => {
    const content = diary.trim();

    if (!content) {
      setDiarySaveMessage('일기를 먼저 작성해 주세요.');
      return;
    }

    if (!userId) {
      setDiarySaveMessage('로그인 후 일기를 저장할 수 있습니다.');
      return;
    }

    const payload: DiarySaveRequest = {
      id: diaryId,
      targetLanguage,
      diaryDate: selectedDate,
      content,
    };

    setIsDiarySaving(true);
    setDiarySaveMessage(null);

    try {
      const response = await fetch('http://localhost:8080/dayline/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save diary: ${response.status}`);
      }

      setDiarySaveMessage('일기를 저장했습니다.');
      await fetchDiary(targetLanguage, selectedDate);
    } catch (error) {
      console.error('handleSaveDiary failed', error);
      setDiarySaveMessage('일기를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsDiarySaving(false);
    }
  };

  const handleLanguageChange = (nextLanguage: string) => {
    setTargetLanguage(nextLanguage);
  };

  const handleLogout = () => {
    localStorage.removeItem('daylineToken');
    setAuthToken(null);
    setUserId(null);
    setUserName(null);
    setDiaryId(null);
    setDiary('');
    setFeedback(null);
    setFeedbackError(null);
    setDiarySaveMessage('로그아웃되었습니다.');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) return;

    localStorage.setItem('daylineToken', token);
    setAuthToken(token);
    setUserId(readJwtSubject(token));
    setUserName(readJwtName(token));

    params.delete('token');
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, []);

  useEffect(() => {
    if (!authToken) return;

    void fetchRecommendation(targetLanguage);
  }, [authToken, targetLanguage]);

  useEffect(() => {
    if (!isLoggedIn) {
      setDiaryId(null);
      setDiary('');
      return;
    }

    void fetchDiary(targetLanguage, selectedDate);
  }, [isLoggedIn, authToken, targetLanguage, selectedDate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#fff8fe_0%,#fff2f9_38%,#ffffff_78%)] px-4 py-8 md:px-8">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
        <div className="pointer-events-none absolute -left-12 top-8 hidden h-28 w-28 rounded-full bg-[#ffd5ec] opacity-60 blur-2xl md:block"></div>
        <div className="pointer-events-none absolute -right-10 top-20 hidden h-28 w-28 rounded-full bg-[#ffe0ef] opacity-70 blur-2xl md:block"></div>

        <Header
          targetLanguage={targetLanguage}
          onChangeLanguage={handleLanguageChange}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogout={handleLogout}
        />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <DateSelector
            selectedDate={selectedDate}
            onChangeDate={(value) => setSelectedDate(value)}
            selectedDateLabel={quickDateText}
          />

          <TopicRecommendationSection
            topics={topicList}
            onRecommend={fetchRecommendation}
            targetLanguage={targetLanguage}
            isLoggedIn={isLoggedIn}
          />
        </section>

        <DiaryEditor
          value={diary}
          onChange={(value) => setDiary(value)}
          onSave={handleSaveDiary}
          isSaving={isDiarySaving}
          isLoggedIn={isLoggedIn}
          saveMessage={diarySaveMessage}
        />
        <QuickTranslateBox
          onLookup={handleLookup}
          targetLanguage={targetLanguage}
          isLoggedIn={isLoggedIn}
        />
        <FeedbackSection
          feedback={feedback}
          error={feedbackError}
          isLoading={isFeedbackLoading}
          isLoggedIn={isLoggedIn}
          onRequestFeedback={handleRequestFeedback}
        />
      </div>
    </div>
  );
}
