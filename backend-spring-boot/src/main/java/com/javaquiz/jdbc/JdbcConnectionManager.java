package com.javaquiz.jdbc;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Provides JDBC Connection instances backed by Spring's pooled DataSource
 * or standalone DriverManager connectivity for raw JDBC operations.
 */
@Component
@RequiredArgsConstructor
public class JdbcConnectionManager {

    private final DataSource dataSource;

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public Connection openStandaloneConnection(String jdbcUrl, String username, String password) throws SQLException {
        return DriverManager.getConnection(jdbcUrl, username, password);
    }
}
