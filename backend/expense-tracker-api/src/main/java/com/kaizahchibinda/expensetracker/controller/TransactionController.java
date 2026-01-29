package com.kaizahchibinda.expensetracker.controller;

import com.kaizahchibinda.expensetracker.dto.SummaryDTO;
import com.kaizahchibinda.expensetracker.dto.TransactionRequest;
import com.kaizahchibinda.expensetracker.model.Transaction;
import com.kaizahchibinda.expensetracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(transactionService.getAllTransactions(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        transactionService.deleteTransaction(id, userDetails.getUsername());
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryDTO> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(transactionService.getSummary(userDetails.getUsername()));
    }
}
