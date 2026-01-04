require('dotenv').config();
const mongoose = require('mongoose');
const bookController = require('./controllers/bookController');

// Sample books data
const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    publishedYear: 1925,
    availableCopies: 5
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    publishedYear: 1960,
    availableCopies: 3
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    publishedYear: 1988,
    availableCopies: 4
  },
  {
    title: 'The Silmarillion',
    author: 'J.R.R. Tolkien',
    category: 'Fiction',
    publishedYear: 1977,
    availableCopies: 2
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    publishedYear: 2011,
    availableCopies: 6
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    publishedYear: 2008,
    availableCopies: 7
  },
  {
    title: 'The Code Breaker',
    author: 'Walter Isaacson',
    category: 'Biography',
    publishedYear: 2021,
    availableCopies: 4
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    category: 'Biography',
    publishedYear: 2018,
    availableCopies: 5
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/libraryDB';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
}

// Main application
async function main() {
  try {
    await connectDB();

    console.log('='.repeat(60));
    console.log('📚 LIBRARY BOOK MANAGEMENT SYSTEM');
    console.log('='.repeat(60));

    // ===================== CREATE: Insert 7+ Books =====================
    console.log('\n1️⃣  INSERT OPERATIONS - Adding 8 books to collection\n');
    console.log('-'.repeat(60));
    await bookController.insertMultipleBooks(sampleBooks);

    // ===================== READ: All Books =====================
    console.log('\n2️⃣  READ OPERATIONS\n');
    console.log('-'.repeat(60));
    console.log('\n📖 Reading ALL BOOKS:');
    const allBooks = await bookController.getAllBooks();
    console.log('\nAll Books:');
    allBooks.forEach(book => {
      console.log(
        `  • "${book.title}" by ${book.author} (${book.category}, ${book.publishedYear}) - ${book.availableCopies} copies`
      );
    });

    // ===================== READ: Books by Category =====================
    console.log('\n📖 Reading BOOKS BY CATEGORY (Fiction):');
    const fictionBooks = await bookController.getBooksByCategory('Fiction');
    console.log('Fiction Books:');
    fictionBooks.forEach(book => {
      console.log(`  • "${book.title}" by ${book.author}`);
    });

    console.log('\n📖 Reading BOOKS BY CATEGORY (Technology):');
    const techBooks = await bookController.getBooksByCategory('Technology');
    console.log('Technology Books:');
    techBooks.forEach(book => {
      console.log(`  • "${book.title}" by ${book.author}`);
    });

    // ===================== READ: Books After Year 2015 =====================
    console.log('\n📖 Reading BOOKS PUBLISHED AFTER 2015:');
    const recentBooks = await bookController.getBooksByYear(2015);
    console.log('Recent Books:');
    recentBooks.forEach(book => {
      console.log(`  • "${book.title}" (${book.publishedYear}) - ${book.availableCopies} copies`);
    });

    // ===================== UPDATE: Increase/Decrease Copies =====================
    console.log('\n3️⃣  UPDATE OPERATIONS\n');
    console.log('-'.repeat(60));
    
    // Get a book ID for testing
    const booksForUpdate = await bookController.getAllBooks();
    const firstBook = booksForUpdate[0];
    const secondBook = booksForUpdate[1];

    console.log(`\n📝 Updating available copies for "${firstBook.title}":`);
    console.log(`   Current copies: ${firstBook.availableCopies}`);
    await bookController.updateAvailableCopies(firstBook._id, 3);
    console.log(`   Added 3 copies`);

    console.log(`\n📝 Decreasing copies for "${secondBook.title}":`);
    console.log(`   Current copies: ${secondBook.availableCopies}`);
    await bookController.updateAvailableCopies(secondBook._id, -1);
    console.log(`   Removed 1 copy`);

    // ===================== UPDATE: Change Category =====================
    console.log(`\n📝 Changing category for "${booksForUpdate[2].title}":`);
    console.log(`   Current category: ${booksForUpdate[2].category}`);
    await bookController.updateCategory(booksForUpdate[2]._id, 'History');

    // ===================== ERROR HANDLING - Negative Stock Prevention =====================
    console.log('\n❌ ERROR HANDLING TESTS:\n');
    console.log('-'.repeat(60));
    
    console.log('\n🚨 Test 1: Negative Stock Prevention');
    try {
      const testBook = await bookController.getBookById(booksForUpdate[3]._id);
      console.log(`   Attempting to remove ${testBook.availableCopies + 5} copies from "${testBook.title}" (has only ${testBook.availableCopies})...`);
      await bookController.updateAvailableCopies(booksForUpdate[3]._id, -(testBook.availableCopies + 5));
    } catch (error) {
      console.log(`   Error caught: "${error.message}"`);
    }

    // ===================== ERROR HANDLING - Book Not Found =====================
    console.log('\n🚨 Test 2: Book Not Found');
    try {
      const fakeId = new mongoose.Types.ObjectId();
      console.log(`   Attempting to find book with ID: ${fakeId}...`);
      await bookController.getBookById(fakeId);
    } catch (error) {
      console.log(`   Error caught: "${error.message}"`);
    }

    // ===================== ERROR HANDLING - Invalid Update =====================
    console.log('\n🚨 Test 3: Invalid Update (Non-integer quantity)');
    try {
      console.log(`   Attempting to update copies with non-integer value...`);
      await bookController.updateAvailableCopies(booksForUpdate[0]._id, 2.5);
    } catch (error) {
      console.log(`   Error caught: "${error.message}"`);
    }

    // ===================== DELETE: Remove Book if Copies = 0 =====================
    console.log('\n4️⃣  DELETE OPERATIONS\n');
    console.log('-'.repeat(60));
    
    // Create a test book with 0 copies for deletion
    const testBookForDeletion = await bookController.createBook({
      title: 'Out of Stock Book',
      author: 'Test Author',
      category: 'Mystery',
      publishedYear: 2020,
      availableCopies: 0
    });

    console.log('\n🗑️  Deleting book with 0 available copies:');
    await bookController.deleteBookIfOutOfStock(testBookForDeletion._id);

    // ===================== ERROR HANDLING - Delete Non-Empty Book =====================
    console.log('\n🚨 Test 4: Cannot Delete Book With Available Copies');
    try {
      const bookWithCopies = await bookController.getBookById(booksForUpdate[0]._id);
      console.log(`   Attempting to delete "${bookWithCopies.title}" with ${bookWithCopies.availableCopies} copies...`);
      await bookController.deleteBookIfOutOfStock(booksForUpdate[0]._id);
    } catch (error) {
      console.log(`   Error caught: "${error.message}"`);
    }

    // ===================== Final Summary =====================
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL SUMMARY');
    console.log('='.repeat(60));
    const finalBooks = await bookController.getAllBooks();
    console.log(`\nTotal books in database: ${finalBooks.length}`);
    console.log('\nBooks Summary:');
    finalBooks.forEach(book => {
      console.log(
        `  • "${book.title}" | Author: ${book.author} | Category: ${book.category} | Year: ${book.publishedYear} | Copies: ${book.availableCopies}`
      );
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ Library Book Management Demo Complete!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the application
main();
