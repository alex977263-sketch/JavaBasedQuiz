package com.javaquiz.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "question_options", uniqueConstraints = {
        @UniqueConstraint(name = "uq_q_key", columnNames = {"question_id", "option_key"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(name = "option_key", nullable = false, length = 1)
    private OptionKey optionKey;

    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;
}
