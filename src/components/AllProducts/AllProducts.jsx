import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegCalendarAlt, FaComments, FaStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getOrCreateConversation } from '../../components/services/chatAPI';
import AnimatedPrice from '../../components/AnimatedPrice/AnimatedPrice';

const gradientStyles = [
  'from-blue-800 via-blue-600 to-blue-400',
  'from-purple-800 via-fuchsia-600 to-pink-500',
  'from-orange-700 via-orange-600 to-yellow-500'
];

export default function Goods() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReviewsPopup, setShowReviewsPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reviewsForProduct, setReviewsForProduct] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [addReviewMode, setAddReviewMode] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const token = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userType");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://lavender-eel-222276.hostingersite.com/api/items')
      .then(response => {
        const fetchedProducts = response.data.items; // ✅ تم التعديل هنا
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          console.error('Products are not in the expected array format');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleBooking = async (productId) => {
    if (!token) {
      toast.error("Please login to book this item.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'https://lavender-eel-222276.hostingersite.com/api/rent/request',
        { item_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking request sent successfully!");
    } catch (error) {
      console.error("Booking error:", error.response ? error.response.data : error.message);
      toast.error("Failed to send booking request.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`https://lavender-eel-222276.hostingersite.com/api/items/${productId}/reviewers`);
      const reviewsArray = Object.values(res.data || {});
      setReviewsForProduct(reviewsArray);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews.");
      setReviewsForProduct([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleShowReviews = (productId) => {
    setSelectedProductId(productId);
    setShowReviewsPopup(true);
    setAddReviewMode(false);
    setNewReview({ rating: 5, comment: '' });
    fetchReviews(productId);
  };

  const closeReviewsPopup = () => {
    setShowReviewsPopup(false);
    setSelectedProductId(null);
    setReviewsForProduct([]);
    setAddReviewMode(false);
    setNewReview({ rating: 5, comment: '' });
  };

  const submitNewReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to add a review.");
      return;
    }
    if (!newReview.rating || !newReview.comment.trim()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    setSubmittingReview(true);

    try {
      await axios.post(
        "https://lavender-eel-222276.hostingersite.com/api/rent/review",
        {
          item_id: selectedProductId,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review added successfully!");
      fetchReviews(selectedProductId);
      setAddReviewMode(false);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error("Error adding review:", error.response ? error.response.data : error.message);
      toast.error("Failed to add review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleChat = async (product) => {
    if (!token) {
      toast.error("Please login to start a chat.");
      return;
    }

    try {
      const conversation = await getOrCreateConversation(
        product.id,
        userData.id,
        product.lender_id,
        token
      );
      navigate(`/chatpage/${conversation.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 relative">
      <ToastContainer />

      <h1 className="text-4xl text-white font-bold text-center mb-10">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product, index) => {
          const imageUrl = product.images?.[0]?.url || '/default-image.png';
          const gradient = gradientStyles[index % gradientStyles.length];

          return (
            <div key={product.id} className={`bg-gradient-to-b ${gradient} rounded-2xl text-white shadow-2xl relative`}>
              <div className="p-6 flex flex-col justify-center items-center">
                <img src={imageUrl} alt={product.title} className="w-full h-56 object-cover mb-4 rounded-lg" />
                <AnimatedPrice price={product.price} />
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-sm text-gray-200 mb-4 line-clamp-3">{product.description}</p>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>

                {product.item_status === 'unavailable' ? (
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">Unavailable</span>
                ) : (
                  userRole === 'customer' && (
                    <div className="flex gap-6 items-center justify-center mb-4">
                      <button onClick={() => handleBooking(product.id)} className="flex flex-col items-center text-white hover:text-yellow-400">
                        <FaRegCalendarAlt size={26} />
                        <span className="text-xs mt-1 font-semibold">Book</span>
                      </button>

                      <button onClick={() => handleChat(product)} className="flex flex-col items-center text-white hover:text-yellow-400">
                        <FaComments size={26} />
                        <span className="text-xs mt-1 font-semibold">Chat</span>
                      </button>

                      <button onClick={() => handleShowReviews(product.id)} className="flex flex-col items-center text-white hover:text-yellow-400">
                        <FaStar size={26} />
                        <span className="text-xs mt-1 font-semibold">Reviews</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showReviewsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={closeReviewsPopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Reviews</h2>

            {reviewsLoading ? (
              <p className="text-center text-gray-600">Loading reviews...</p>
            ) : reviewsForProduct.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {reviewsForProduct.map((review, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="text-sm text-gray-700 font-semibold">Rating: {review.rating}⭐</p>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No reviews yet.</p>
            )}

            {userRole === 'customer' && (
              <>
                {!addReviewMode ? (
                  <button
                    onClick={() => setAddReviewMode(true)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Add Review
                  </button>
                ) : (
                  <form onSubmit={submitNewReview} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                      >
                        {[1, 2, 3, 4, 5].map((rate) => (
                          <option key={rate} value={rate}>{rate}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
