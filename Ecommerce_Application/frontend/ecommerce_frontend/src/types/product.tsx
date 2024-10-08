interface RatingAndReviewProps {
    productId: number;
}

interface Review {
    id: number;
    review: string;
    user: User;
    ratingValue: number;
}

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}