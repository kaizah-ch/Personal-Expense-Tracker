package com.kaizahchibinda.expensetracker.dto;

import com.kaizahchibinda.expensetracker.model.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private TransactionType type;
    private String category;
}
