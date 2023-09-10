# Image Annotation Tool

Welcome to the Image Annotation Tool! This project was generated using Angular version 16.1.4. You can explore the live project on [Image Annotation Tool](https://image-anno-tool.netlify.app/).

## Table of Contents
- [Development Server](#development-server)
- [Features](#features)
    1. [Make Boundaries on Images](#1-make-boundaries-on-images)
    2. [Move, Edit, and Remove Boundaries](#2-move-edit-and-remove-boundaries)
    3. [Input Fields to Edit](#3-input-fields-to-edit)
    4. [Download JSON Data](#4-download-json-data)
    5. [Download Boundaries](#5-download-boundaries)

## Development Server

To run the development server, follow these steps:

1. Clone the repository.
2. Run `ng serve` for a development server.
3. Navigate to `http://localhost:4200/` in your web browser.

The application will automatically reload if you change any of the source files.

## Features

### 1. Make Boundaries on Images

With the Image Annotation Tool, you can easily create boundaries on images in different colors. Just select a color from the input color box before making boundaries.

### 2. Move, Edit, and Remove Boundaries

Take control of your annotations by moving the entire rectangle, adjusting its boundaries, or removing them. Here's how:
- Create a boundary using the mouse and save it.
- Click on the edit button to make further adjustments or drag it.
- You can select individual sides to fine-tune your annotations.
- To remove a boundary, select it after clicking on the Edit button and then click the Remove button.

### 3. Input Fields to Edit

For precise annotations, use input fields to edit boundary dimensions and positions, ensuring accuracy in your annotations.

### 4. Download JSON Data

Easily export your annotations as JSON object data for all boundaries in all images. Images of the background are stored in a global array, and you can add your own links to edit your images without any need to change the code.

### 5. Download Boundaries

This functionality is available but commented out in both TypeScript and HTML code. Simply uncomment it to use it and download boundaries in visual form.

Thank you for using the Image Annotation Tool! We hope you find it useful for your image annotation needs. If you have any questions or suggestions, feel free to reach out or contribute to the project.
