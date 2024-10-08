interface ProductCardProps {
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageUrl?: string;
    };
}

interface FilterTabProps {
    open: boolean;
    onClose: () => void;
}