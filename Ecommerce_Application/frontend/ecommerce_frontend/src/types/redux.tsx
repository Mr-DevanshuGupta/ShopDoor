interface LoginResponse {
    token: string;
    id: string;
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    error: string | null;
}

interface Product {
    id: number;
    name: string;
    brand : Brand;
    description: string;
    price: number;
    imageUrl?: string;
    stockQuantity: number;
    category: Category;
    active : boolean;
}

interface ProductImage {
    fileName: string;
}

interface FetchProductsPayload {
    pageNumber: number;
    pageSize: number;
    keyword? : string;
}

interface ProductsState {
    products: Product[];
    product: Product | null;
    totalElements : number;
    status: 'idle' | 'loading' | 'failed' | 'succeeded';
    error: string | null;

}
interface AverageRating{
    averageRating: number
}

interface Review {
    id: number;
    product: Product;
    user: User;
    ratingValue: number;
    review: string;
    createdAt: string;
    updatedAt: string | null;
}

interface FetchRatingsAndReviewsRequestPayload {
    id: number;
}

interface SizeCategory {
    id: number;
    sizeType: string;
}

interface SizeVariant {
    id: number;
    sizeCategory: SizeCategory;
    sizeValue: string; 
}

interface ColorVariant {
    id: number;
    name: string;
}

interface ProductVariantState {
    colorVariant : ColorVariant[];
    sizeVariant: SizeVariant[];
    sizeCategories : SizeCategory[];
    productVariant : ProductVariant | null;
    productVariants : ProductVariant[];
    status: 'idle' | 'loading' | 'failed' | 'succeeded';
    error: string | null;
}

interface Wishlist{
    id:number;
    product : Product;
    user:User;
}

interface Cart{
    id: number;
    productVariant : ProductVariant;
    product : Product;
    user: User;
    quantity: number;
}

interface cartUpdate{
    userId: number;
    quantity: number;
    variantId: number;
    productId: number;
}

// interface productVariantrequest{
//     productId: number;
//     sizeVariantId: number;
//     colorVariantId: number;
// }

interface ProductVariant{
    id: number;
    product : Product;
    quantity: number;
    sizeVariant : SizeVariant;
    colorVariant : ColorVariant;
}

interface Country{
    id: number;
    name : string;
}

interface State{
    id: number;
    name : string;
    country : Country;
}

interface City{
    id: number;
    name: string;
    state : State;
}

interface Address{
    id: number;
    street_address : string;
    city : City;
    state: State;
    country : Country;
    user : User;
}

interface AddressDTO{
    street_address : string;
    cityId: number;
    stateId: number;
    countryId: number;
}

type PaymentMethod = "Card" | "Cash";

type OrderStatus = "Ordered" | "Dispatched" | "Delivered" | "Cancelled";

interface Order{
    id: number;
    status: OrderStatus;
    user : User;
    totalAmount : number;
    address : Address;
    payment : PaymentMethod;
    orderedAt : string;
    deliveredDate  : string | null;
    updatedAt  : string | null;
}
interface PlaceOrderRequest {
    totalAmount: number;
    addressId: number;
    payment: PaymentMethod;
}

interface PlaceOrderResponse {
    id: number;
    status: OrderStatus;
    user: User;
    totalAmount: number;
    address: Address;
    orderedAt: string;
    updatedAt: string | null;
    deliveredDate: string | null;
    payment: 'Card' | 'Cash';
}

interface OrderItem {
    id: number;
    order: Order;
    productVariant: ProductVariant;
    product: Product;
    quantity: number;
}

interface AddOrderItemRequest {
    productId: number;
    variantId: number;
    orderId: number;
    quantity: number;
}

interface AddOrderItemResponse {
    id: number;
    order: Order;
    productVariant: ProductVariant;
    product: Product;
    quantity: number;
}

interface CustomPaymentRequest{
    amount: number;
    cardNumber : string;
    cvv : number;
}

interface OrderItem{
    id: number;
    order: Order;
    productVariant : ProductVariant;
    product : Product;
    quantity : number;
}

interface Category{
    id: number;
    name: string;
    description : string;
    parent_id ?  : number | null;
}

interface CategoryRequest{
    id: number;
}

interface ProductWithVariantsRequest{
    name: string;
    price : number;
    brand: BrandRequest;
    description : string;
    stockQuantity : number;
    category : CategoryRequest;
    variants? : ProductVariantRequest[];
    file? : File[] | null;
}   

interface ProductWithVariantsUpdateRequest{
    name: string;
    price: number;
    brand: BrandRequest;
    description : string;
    stockQuantity: number;
    category: CategoryRequest;
    variants ? : ProductVariant[];
    file? :File[] | null;
}

interface BrandRequest{
    id: number;
}

interface ProductVariantRequest{
    colorVariantId : number | null;
    sizeVariantId : number | null;
    quantity : number;
}

interface SearchProductRequest{
    pageNumber : number;
    pageSize : number;
    keyword : string;
}

interface addCategoryRequest{
    name: string;
    description : string;
    parent_id ?  : number | null;
}

interface Brand{
    id: number;
    name: string;
    tagLine : string;
    categories : Category[];
    isActive? : Boolean;
}

interface AddBrandInput {
    name: string;
    tagLine: string;
    categoryIds: number[];
  }

  interface ProductResponse{
    products : Product[];
    totalItems: number;
  }
  
  interface OrderResponse{
    orders : Order[];
    totalItems: number;
  }

  interface UserResponse{
    users : User[];
    totalItems: number;
  }

  interface CategoryResponse{
    categories : Category[];
    totalItems : number;
  }

  interface BrandResponse{
    brands : Brand[];
    totalItems : number;
  }