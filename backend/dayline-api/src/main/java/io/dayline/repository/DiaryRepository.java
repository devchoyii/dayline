package io.dayline.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.dayline.entity.Diary;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    Optional<Diary> findByIdAndUser_Id(Long id, Long userId);
    Optional<Diary> findByUser_IdAndTargetLanguageAndDiaryDate(Long userId, String targetLanguage, LocalDate diaryDate);
    
}
