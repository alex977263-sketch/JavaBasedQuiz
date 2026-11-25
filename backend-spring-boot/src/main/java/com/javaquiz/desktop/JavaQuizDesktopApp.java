package com.javaquiz.desktop;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Pure Java Swing Desktop Client that connects to the Spring Boot REST API
 * using java.net.http.HttpClient to authenticate users and browse available quizzes.
 */
public class JavaQuizDesktopApp extends JFrame {

    private static final String DEFAULT_API_BASE = "http://localhost:8080/api/v1";

    private final HttpClient httpClient;
    private final JTextField emailField;
    private final JPasswordField passwordField;
    private final JTextArea outputArea;
    private String jwtToken;

    public JavaQuizDesktopApp() {
        super("JavaQuiz Pro - Java Desktop Client");
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(760, 520);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout(12, 12));
        root.setBorder(new EmptyBorder(16, 16, 16, 16));
        root.setBackground(new Color(248, 250, 252));

        JLabel header = new JLabel("Java-Based Online Quiz Platform (Spring Boot Client)");
        header.setFont(new Font("SansSerif", Font.BOLD, 18));
        header.setForeground(new Color(15, 23, 42));
        root.add(header, BorderLayout.NORTH);

        JPanel authPanel = new JPanel(new GridBagLayout());
        authPanel.setBackground(Color.WHITE);
        authPanel.setBorder(BorderFactory.createTitledBorder("Sign In via REST API (/auth/login)"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 8, 6, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        emailField = new JTextField("participant@javaquiz.com", 22);
        passwordField = new JPasswordField("Participant@2026!", 22);

        gbc.gridx = 0; gbc.gridy = 0;
        authPanel.add(new JLabel("Email:"), gbc);
        gbc.gridx = 1;
        authPanel.add(emailField, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        authPanel.add(new JLabel("Password:"), gbc);
        gbc.gridx = 1;
        authPanel.add(passwordField, gbc);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        btnPanel.setOpaque(false);
        JButton loginBtn = new JButton("Sign In");
        JButton fetchQuizzesBtn = new JButton("Fetch Approved Quizzes");
        JButton fetchStatsBtn = new JButton("My Performance Stats");
        btnPanel.add(loginBtn);
        btnPanel.add(fetchQuizzesBtn);
        btnPanel.add(fetchStatsBtn);

        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2;
        authPanel.add(btnPanel, gbc);

        outputArea = new JTextArea();
        outputArea.setEditable(false);
        outputArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        outputArea.setText("Ready. Start Spring Boot backend on port 8080 and click 'Fetch Approved Quizzes' or 'Sign In'.\n");

        JPanel center = new JPanel(new BorderLayout(10, 10));
        center.setOpaque(false);
        center.add(authPanel, BorderLayout.NORTH);
        center.add(new JScrollPane(outputArea), BorderLayout.CENTER);
        root.add(center, BorderLayout.CENTER);

        loginBtn.addActionListener(e -> performLogin());
        fetchQuizzesBtn.addActionListener(e -> fetchEndpoint("/quizzes", false));
        fetchStatsBtn.addActionListener(e -> fetchEndpoint("/participant/stats", true));

        setContentPane(root);
    }

    private void performLogin() {
        String email = emailField.getText().trim();
        String pass = new String(passwordField.getPassword());
        String payload = String.format("{\"emailOrUsername\":\"%s\",\"password\":\"%s\"}",
                escapeJson(email), escapeJson(pass));

        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override
            protected String doInBackground() throws Exception {
                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(DEFAULT_API_BASE + "/auth/login"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(payload))
                        .build();
                HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
                if (resp.statusCode() == 200) {
                    extractToken(resp.body());
                }
                return "HTTP " + resp.statusCode() + "\n" + resp.body();
            }

            @Override
            protected void done() {
                try {
                    outputArea.setText(get());
                } catch (Exception ex) {
                    outputArea.setText("Connection error: " + ex.getMessage());
                }
            }
        };
        worker.execute();
    }

    private void fetchEndpoint(String path, boolean requiresAuth) {
        if (requiresAuth && (jwtToken == null || jwtToken.isBlank())) {
            outputArea.setText("Please Sign In first to obtain a JWT Bearer token.");
            return;
        }
        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override
            protected String doInBackground() throws Exception {
                HttpRequest.Builder builder = HttpRequest.newBuilder()
                        .uri(URI.create(DEFAULT_API_BASE + path))
                        .GET();
                if (requiresAuth) {
                    builder.header("Authorization", "Bearer " + jwtToken);
                }
                HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
                return "GET " + path + " -> HTTP " + resp.statusCode() + "\n" + resp.body();
            }

            @Override
            protected void done() {
                try {
                    outputArea.setText(get());
                } catch (Exception ex) {
                    outputArea.setText("Request failed: " + ex.getMessage());
                }
            }
        };
        worker.execute();
    }

    private void extractToken(String body) {
        String marker = "\"accessToken\":\"";
        int idx = body.indexOf(marker);
        if (idx >= 0) {
            int start = idx + marker.length();
            int end = body.indexOf('"', start);
            if (end > start) {
                jwtToken = body.substring(start, end);
            }
        }
    }

    private static String escapeJson(String input) {
        return input.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new JavaQuizDesktopApp().setVisible(true));
    }
}
