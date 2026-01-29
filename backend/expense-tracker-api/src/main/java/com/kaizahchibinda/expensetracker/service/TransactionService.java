package com.kaizahchibinda.expensetracker.service;

import com.kaizahchibinda.expensetracker.dto.SummaryDTO;
import com.kaizahchibinda.expensetracker.dto.TransactionRequest;
import com.kaizahchibinda.expensetracker.model.Transaction;
import com.kaizahchibinda.expensetracker.model.TransactionType;
import com.kaizahchibinda.expensetracker.model.User;
import com.kaizahchibinda.expensetracker.repository.TransactionRepository;
import com.kaizahchibinda.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<Transaction> getAllTransactions(String username) {
        User user = getUserByUsername(username);
        return transactionRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    @Transactional
    public Transaction createTransaction(TransactionRequest request, String username) {
        User user = getUserByUsername(username);

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .date(request.getDate())
                .description(request.getDescription())
                .type(request.getType())
                .category(request.getCategory())
                .user(user)
                .build();

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Long id, TransactionRequest request, String username) {
        User user = getUserByUsername(username);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this transaction");
        }

        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setDescription(request.getDescription());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(Long id, String username) {
        User user = getUserByUsername(username);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public SummaryDTO getSummary(String username) {
        List<Transaction> transactions = getAllTransactions(username);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> incomeByCategory = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)));

        Map<String, BigDecimal> expenseByCategory = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)));

        return SummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome.subtract(totalExpense))
                .incomeByCategory(incomeByCategory)
                .expenseByCategory(expenseByCategory)
                .build();
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
