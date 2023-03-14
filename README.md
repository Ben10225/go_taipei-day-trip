# [Taipei-day-trip (Go)](https://taipei-day-trip.beelinetw.com)

Taipei-day-trip is an E-commerce website that offers itinerary reservation, tour purchase, and member information.

<br/>

This project was built with Go Gin and pure JavaScript, and there's also a [Python Flask](https://github.com/Ben10225/go_taipei-day-trip) (GitHub) version for practice.

<br/>

## Live Demo
#### website: https://taipei-day-trip.beelinetw.com
![](https://github.com/Ben10225/taipei-day-trip/blob/develop/public/images/taipei-day-trip-demo.gif)

Here is the testing credit card info for booking page.
|Column| Submit value|
|---|---|
|Card number|4242424242424242|
|Card Expiration|01 / 24|
|Card verification number|123|

## Table of Contents

- [Main Features](#main-features)
- [Backend Technique](#backend-technique)
  - [Framework](#framework)
  - [Infrastructure](#infrastructure)
  - [Database](#database)
  - [Cloud Services](#cloud-services)
  - [Version Control](#version-control)
- [Frontend Technique](#frontend-technique)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Design Doc](#design-doc)

## Main Features

- Member system with JWT token.
- RWD with CSS Grid.
- Infinite scroll / Image carousel.
- Shopping cart system.
- Third-party payment system with TapPay.
- Review history bookings.
- Store images with AWS S3.

## Backend Technique

### Framework

- Go (Gin)

### Infrastructure

- DNS
- Nginx
- SSL (Zero SSL)

### Database

- MySQL
- Gorm

### Cloud Services

- EC2

### Version Control

- Git / GitHub

## Frontend Technique

- HTML
- CSS (SCSS)
- JavaScript

## Architecture

<img src="https://github.com/Ben10225/go_taipei-day-trip/blob/develop/public/images/tp-structure.jpg" width=600 />

## Database Schema

<img src="https://github.com/Ben10225/taipei-day-trip/blob/develop/public/images/tp-database.png" width=600 />

## Design Doc

[Figma](https://www.figma.com/file/MZkYBH31H5gyLoZoZq116j)
</br>

[API Doc](https://app.swaggerhub.com/apis-docs/padax/taipei-day-trip/1.1.0)
