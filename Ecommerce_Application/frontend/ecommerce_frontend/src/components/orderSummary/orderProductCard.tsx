import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";

interface OrderProductCardProps {
  item: {
    product: {
      id: number;
      name: string;
      price: number;
      imageUrl?: string;
    };
    productVariant?: {
      colorVariant: { name: string };
      sizeVariant: { sizeValue: string };
    };
    quantity: number;
  };
}

const OrderProductCard = ({ item }: OrderProductCardProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    item.product.imageUrl
  );

  useEffect(() => {
    if (!item.product.imageUrl) {
      console.log("THis is a item inside orderProductCard ", item);
      fetchProductImage(item.product.id).then((data) => {
        if (data) {
          const url = createImageBlobUrl(data);
          setImageSrc(url);
        }
      });
    }
  }, [item.product.id, item.product.imageUrl, item]);

  async function fetchProductImage(productId: number) {
    try {
      const response = await axios.get(
        `http://localhost:8080/images/product/${productId}`,
        {
          responseType: "arraybuffer",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }

  function createImageBlobUrl(data: ArrayBuffer) {
    const blob = new Blob([data], { type: "image/png" });
    return URL.createObjectURL(blob);
  }

  return (
    <Card
      sx={{
        maxWidth: 500, // Wider card for similar layout
        margin: 2,
        padding: 2,
        border: "1px solid #e0e0e0", // Subtle border
        borderRadius: 2,
        boxShadow: "none", // Remove default shadow
        display: "flex", // Align items in a row
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 120,
          width: 120,
          objectFit: "contain",
          borderRadius: 1,
        }}
        image={imageSrc || "/samsungf23.jpg"}
        alt={item.product.name}
      />
      <CardContent sx={{ flex: 1, paddingLeft: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "16px" }}
          >
            {item.product.name}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: "#212121", marginTop: 1 }}>
          <CurrencyRupeeIcon sx={{ fontSize: 15 }} />
          {item.product.price.toFixed(2)}
          <Typography
            variant="body2"
            component="span"
            sx={{ textDecoration: "line-through", marginLeft: 1 }}
          >
            ₹{(item.product.price * 1.2).toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#4caf50", marginLeft: 1 }}
          >
            {/* {item.product.discount}% Off */}
            20% Off
          </Typography>
        </Typography>

        <Box sx={{ marginTop: 1, display: "flex", alignItems: "center" }}>
          {item.productVariant && (
            <Typography
            variant="body2"
            sx={{ color: "#333", fontWeight: "500", marginRight: 1 }}
          >
            Color: {item.productVariant.colorVariant.name}
            {/* Size : M */}
          </Typography>
          )}
          {item.productVariant && (
          <Typography
            variant="body2"
            sx={{ color: "#333", fontWeight: "500", marginRight: 1 }}
          >
            Size: {item.productVariant.sizeVariant.sizeValue}
            {/* Size : M */}
          </Typography>
          )}
          <Typography
            variant="body2"
            sx={{ color: "#333", fontWeight: "500", marginRight: 1 }}
          >
            Qty: {item.quantity}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
            borderTop: "1px solid #e0e0e0",
            paddingTop: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#757575" }}>
            {/* Sold by: {item.product.sellerName} */}
            Sold by : Devanshu Gupta
          </Typography>
          <Typography variant="body2" sx={{ color: "#757575" }}>
            Delivery Fee: ₹{50}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderProductCard;
