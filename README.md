# Library Book Management System

A comprehensive MongoDB-based library management system with complete CRUD operations and error handling.

## Project Structure

```
├── models/
│   └── Book.js                 # Mongoose schema and model
├── controllers/
│   └── bookController.js       # CRUD operations
├── server.js                   # Main application
├── package.json                # Dependencies
├── .env                        # Environment variables
└── README.md                   # Documentation
```

## Database Schema

**Database:** `libraryDB`  
**Collection:** `books`

### Fields:
- `title` (String, required) - Book title
- `author` (String, required) - Author name
- `category` (String, required) - Book category (Fiction, Non-Fiction, Science, History, Biography, Technology, Mystery)
- `publishedYear` (Number, required) - Year of publication
- `availableCopies` (Number, required, default: 1) - Number of available copies
- `timestamps` - Auto-generated createdAt and updatedAt

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variable management

### 2. MongoDB Setup
Ensure MongoDB is running locally on `localhost:27017` or update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/libraryDB
```

### 3. Run the Application
```bash
npm start
```

## Features Implemented

### ✅ CREATE Operations
- **insertMultipleBooks()** - Insert 8 sample books
- **createBook()** - Create individual books with validation

### ✅ READ Operations
- **getAllBooks()** - Retrieve all books
- **getBooksByCategory()** - Filter books by category
- **getBooksByYear()** - Get books published after a specific year
- **getBookById()** - Get single book by ID

### ✅ UPDATE Operations
- **updateAvailableCopies()** - Increase or decrease book copies
- **updateCategory()** - Change book category
- **updateBook()** - Update any book field

### ✅ DELETE Operations
- **deleteBookIfOutOfStock()** - Delete books only if copies = 0
- **deleteBook()** - Force delete a book

## Error Handling

### 1. **Book Not Found**
```javascript
throw new Error(`Book not found with ID: ${bookId}`);
```

### 2. **Negative Stock Prevention**
```javascript
if (newCopies < 0) {
  throw new Error(`Negative stock prevention: Cannot have negative available copies...`);
}
```

### 3. **Invalid Updates**
- Non-integer quantity changes
- Invalid category values
- Schema validation errors

### 4. **Delete Restrictions**
- Cannot delete books with available copies > 0

## Sample Data

The application inserts 8 books with various categories and years:
1. The Great Gatsby (1925, Fiction)
2. To Kill a Mockingbird (1960, Fiction)
3. A Brief History of Time (1988, Science)
4. The Silmarillion (1977, Fiction)
5. Sapiens (2011, Non-Fiction)
6. Clean Code (2008, Technology)
7. The Code Breaker (2021, Biography)
8. Educated (2018, Biography)

## Console Output

The application provides detailed console logging for:
- ✅ Successful operations
- ⚠️ Warnings (e.g., no results found)
- ❌ Errors with detailed messages
- 📚 Data display and summaries

## Running the Demo

When you run `npm start`, the application will:
1. Connect to MongoDB
2. Insert 8 sample books
3. Demonstrate READ operations (all books, by category, by year)
4. Demonstrate UPDATE operations (copies, category)
5. Test error handling scenarios
6. Demonstrate DELETE operations
7. Display final summary

All operations include proper error handling and informative console messages.
