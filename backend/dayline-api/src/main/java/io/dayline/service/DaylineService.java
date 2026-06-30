package io.dayline.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Service;

import io.dayline.dto.DiaryRequest;
import io.dayline.dto.DiaryResponse;
import io.dayline.entity.Diary;
import io.dayline.entity.User;
import io.dayline.repository.DiaryRepository;
import io.dayline.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DaylineService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveDiary(Long userId, DiaryRequest request) {
        String now = Instant.now().toString();

        if (request.getId() != null) {
            Diary diary = diaryRepository.findByIdAndUser_Id(request.getId(), userId)
                .orElseThrow(() -> new RuntimeException("Diary not found."));
            
            diary.updateContent(request.getContent(), now);
            return;
        }

        Optional<Diary> existingDiary =
            diaryRepository.findByUser_IdAndTargetLanguageAndDiaryDate(
                userId,
                request.getTargetLanguage(),
                request.getDiaryDate()
            );

        if (existingDiary.isPresent()) {
            Diary diary = existingDiary.get();
            diary.updateContent(request.getContent(), now);
            return;
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found."));

        Diary diary = new Diary(
            user,
            request.getDiaryDate(),
            request.getTargetLanguage(),
            request.getContent(),
            now,
            now
        );

        diaryRepository.save(diary);
    }

    public DiaryResponse selectDiary(Long userId, DiaryRequest request) {
        Optional<Diary> optionalDiary =
            diaryRepository.findByUser_IdAndTargetLanguageAndDiaryDate(
                userId,
                request.getTargetLanguage(),
                request.getDiaryDate()
            );

        if (optionalDiary.isPresent()) {
            Diary diary = optionalDiary.get();

            return new DiaryResponse(
                diary.getId(),
                diary.getTargetLanguage(),
                diary.getDiaryDate(),
                diary.getContent()
            );
        }

        return new DiaryResponse(
            null,
            request.getTargetLanguage(),
            request.getDiaryDate(),
            null
        );
    }
}
