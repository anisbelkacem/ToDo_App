package com.example.todo.model;

import jakarta.persistence.*;

@Entity
public class Task {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private boolean completed;
    public Long getId() {
        return id;
    }
    public Task() {
    }

    public Task(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    public String getTitle() {
        return title;
    }
    public boolean isCompleted() {
        return completed;
    }
}