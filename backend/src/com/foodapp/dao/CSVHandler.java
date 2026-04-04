package com.foodapp.dao;

import java.io.*;
import java.util.*;

public class CSVHandler {
    
    // Get the correct file path (works from any working directory)
    private static String getFilePath(String filename) {
        // Try multiple possible locations
        String userDir = System.getProperty("user.dir");
        
        // List of possible paths to check
        String[] possiblePaths = {
            userDir + "/backend/data/" + filename,
            userDir + "/data/" + filename,
            userDir + "/../backend/data/" + filename,
            "backend/data/" + filename,
            "data/" + filename
        };
        
        for (String path : possiblePaths) {
            File file = new File(path);
            if (file.exists()) {
                System.out.println("Found file at: " + path);
                return path;
            }
        }
        
        // If no file exists, use the first path (will create new file)
        System.out.println("No existing file found, will use: " + possiblePaths[0]);
        return possiblePaths[0];
    }
    
    // Read all lines from a CSV file
    public static List<String[]> readAll(String filename) {
        List<String[]> records = new ArrayList<>();
        String filePath = getFilePath(filename);
        
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] values = line.split("\\|");
                records.add(values);
            }
            System.out.println("Read " + records.size() + " records from " + filename);
        } catch (IOException e) {
            System.out.println("Error reading file: " + filePath);
            e.printStackTrace();
        }
        return records;
    }
    
    // Write all lines to a CSV file (overwrites)
    public static void writeAll(String filename, List<String[]> records) {
        String filePath = getFilePath(filename);
        
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath))) {
            for (String[] record : records) {
                bw.write(String.join("|", record));
                bw.newLine();
            }
            System.out.println("Wrote " + records.size() + " records to " + filename);
        } catch (IOException e) {
            System.out.println("Error writing file: " + filePath);
            e.printStackTrace();
        }
    }
    
    // Append a single line to CSV file
    public static void append(String filename, String[] record) {
        String filePath = getFilePath(filename);
        
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath, true))) {
            bw.write(String.join("|", record));
            bw.newLine();
            System.out.println("Appended record to " + filename);
        } catch (IOException e) {
            System.out.println("Error appending to file: " + filePath);
            e.printStackTrace();
        }
    }
    
    // Get next ID for a CSV file
    public static int getNextId(String filename) {
        List<String[]> records = readAll(filename);
        if (records.isEmpty()) return 1;
        int maxId = 0;
        for (String[] record : records) {
            try {
                int id = Integer.parseInt(record[0]);
                if (id > maxId) maxId = id;
            } catch (NumberFormatException e) {}
        }
        return maxId + 1;
    }
}