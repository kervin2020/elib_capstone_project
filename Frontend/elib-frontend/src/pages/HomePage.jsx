import React, {
 useEffect 
}
 from 'react';
 
import {
 Link 
}
 from 'react-router-dom';
 
import {
 Search, BookOpen, Users, TrendingUp, Star, ArrowRight, Clock, Globe 
}
 from 'lucide-react';
 
import {
 useBooks 
}
 from '../contexts/BookContext';
 
import {
 useLoans 
}
 from '../contexts/LoanContext';
 
import BookCard from '../components/common/BookCard';
 
import LoadingSpinner from '../components/common/LoadingSpinner';
 
const HomePage = ()
 => {
 
const {
 books, fetchBooks, isLoading: booksLoading 
}
 = useBooks()
;
 
const {
 stats 
}
 = useLoans()
;
 useEffect(()
 => {
 fetchBooks()
;
 
}
, [fetchBooks])
;
 
// Get featured books (first 6 books)
 
const featuredBooks = books.slice(0, 6)
;
 
const recommendedBooks = books.slice(6, 8)
;
 
// Mock user reviews 
const reviews = [ {
 id: 1, name: 'Emma Johnson', rating: 5, comment: 'Amazing collection! I found so many great books here.', avatar: 'EJ' 
}
, {
 id: 2, name: 'Liam Smith', rating: 5, comment: 'The online reading experience is fantastic. Highly recommended!', avatar: 'LS' 
}
, {
 id: 3, name: 'Sophia Brown', rating: 4, comment: 'Great selection of both digital and physical books.', avatar: 'SB' 
}
, {
 id: 4, name: 'Michael Davis', rating: 5, comment: 'Easy to use and the staff is very helpful.', avatar: 'MD' 
}
 ];
 return ( <div className="min-h-screen bg-gray-50"> {

/* Hero Section */

}
 <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"> <div className="text-center"> <h1 className="text-4xl md:text-6xl font-bold mb-6"> Welcome to <span className="text-accent-400">E-Lib</span> </h1> <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"> Read online or loan physical books easily. Your digital library for endless knowledge. </p> {

/* Search Bar */

}
 <div className="max-w-2xl mx-auto mb-8"> <div className="relative"> <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> <input type="text" placeholder="Search in site..." className="w-full pl-12 pr-4 py-4 text-lg rounded-lg text-gray-900 focus:ring-2 focus:ring-accent-500 focus:border-transparent" /> </div> </div> {

/* CTA Buttons */

}
 <div className="flex flex-col sm:flex-row gap-4 justify-center"> <Link to="/register" className="btn-secondary text-lg px-8 py-4" > Join Now </Link> <Link to="/books" className="btn-primary text-lg px-8 py-4" > Browse Books </Link> </div> </div> </div> </section> {

/* Library Stats Section */

}
 <section className="py-16 bg-white"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> <div> <h2 className="text-3xl font-bold text-gray-900 mb-4">Library Stats</h2> <p className="text-lg text-gray-600 mb-6"> Discover our extensive collection of digital and physical books, serving thousands of readers worldwide. </p> <Link to="/books" className="btn-primary" > View Details </Link> </div> <div className="bg-gray-50 rounded-xl p-8"> <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Loans</h3> {

/* Simple bar chart representation */

}
 <div className="space-y-4"> <div className="flex items-center justify-between"> <span className="text-sm text-gray-600">January</span> <div className="flex items-center space-x-2"> <div className="w-32 bg-gray-200 rounded-full h-2"> <div className="bg-primary-600 h-2 rounded-full" style={
{
width: '75%'
}

}
></div> </div> <span className="text-sm font-medium">150</span> </div> </div> <div className="flex items-center justify-between"> <span className="text-sm text-gray-600">February</span> <div className="flex items-center space-x-2"> <div className="w-32 bg-gray-200 rounded-full h-2"> <div className="bg-primary-600 h-2 rounded-full" style={
{
width: '90%'
}

}
></div> </div> <span className="text-sm font-medium">180</span> </div> </div> <div className="flex items-center justify-between"> <span className="text-sm text-gray-600">March</span> <div className="flex items-center space-x-2"> <div className="w-32 bg-gray-200 rounded-full h-2"> <div className="bg-primary-600 h-2 rounded-full" style={
{
width: '100%'
}

}
></div> </div> <span className="text-sm font-medium">200</span> </div> </div> </div> </div> </div> {

/* Stats Cards */

}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"> <div className="bg-white rounded-xl shadow-lg p-6 text-center"> <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" /> <h3 className="text-2xl font-bold text-gray-900 mb-2">5,000</h3> <p className="text-gray-600">Total Books</p> </div> <div className="bg-white rounded-xl shadow-lg p-6 text-center"> <Globe className="h-12 w-12 text-primary-600 mx-auto mb-4" /> <h3 className="text-2xl font-bold text-gray-900 mb-2">2,000</h3> <p className="text-gray-600">E-Books</p> </div> <div className="bg-white rounded-xl shadow-lg p-6 text-center"> <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" /> <h3 className="text-2xl font-bold text-gray-900 mb-2">1,500</h3> <p className="text-gray-600">Registered Users</p> </div> </div> </div> </section> {

/* Books Section */

}
 <section className="py-16 bg-gray-50"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="text-center mb-12"> <h2 className="text-3xl font-bold text-gray-900 mb-4">Books</h2> <p className="text-lg text-gray-600"> List of all E-books and physical books in the library. </p> </div> {
booksLoading ? ( <LoadingSpinner size="large" className="py-12" /> )
 : ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {
featuredBooks.map((book)
 => ( <BookCard key={
book.id
}
 book={
book
}
 /> )
)

}
 </div> )

}
 <div className="text-center mt-8"> <Link to="/books" className="btn-primary inline-flex items-center space-x-2" > <span>View All Books</span> <ArrowRight className="h-4 w-4" /> </Link> </div> </div> </section> {

/* Recommended Reads Section */

}
 <section className="py-16 bg-white"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="text-center mb-12"> <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Reads</h2> <p className="text-lg text-gray-600"> Handpicked books just for you. </p> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {
recommendedBooks.map((book)
 => ( <div key={
book.id
}
 className="card p-6"> <div className="flex items-start space-x-4"> <div className="flex-shrink-0"> <div className="w-16 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center"> <BookOpen className="h-8 w-8 text-primary-600" /> </div> </div> <div className="flex-1"> <h3 className="text-lg font-semibold text-gray-900 mb-2">{
book.title
}
</h3> <p className="text-gray-600 mb-3">{
book.author
}
</p> <p className="text-sm text-gray-500 mb-4 line-clamp-2">{
book.description
}
</p> <Link to={
`/books/${
book.id
}
`
}
 className="text-primary-900 hover:text-primary-800 font-medium" > View More → </Link> </div> </div> </div> )
)

}
 </div> </div> </section> {

/* User Reviews Section */

}
 <section className="py-16 bg-gray-50"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="text-center mb-12"> <h2 className="text-3xl font-bold text-gray-900 mb-4">User Reviews</h2> <p className="text-lg text-gray-600"> What our readers say about us. </p> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {
reviews.map((review)
 => ( <div key={
review.id
}
 className="card p-6"> <div className="flex items-center space-x-3 mb-4"> <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"> <span className="text-sm font-medium text-primary-900">{
review.avatar
}
</span> </div> <div> <h4 className="font-medium text-gray-900">{
review.name
}
</h4> <div className="flex items-center space-x-1"> {
[...Array(5)
].map((_, i)
 => ( <Star key={
i
}
 className={
`h-4 w-4 ${
 i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300' 
}
`
}
 /> )
)

}
 </div> </div> </div> <p className="text-gray-600 text-sm">{
review.comment
}
</p> </div> )
)

}
 </div> </div> </section> </div> )
;
 
}
;
 
export default HomePage;
 