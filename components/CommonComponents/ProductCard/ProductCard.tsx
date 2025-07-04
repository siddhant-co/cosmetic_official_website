"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { selectIsLoggedIn } from "@/store/slices/authSlice";
import { useLoggedInCart } from "@/CartProvider/LoggedInCartProvider";
import { Product, ProductVariant } from "@/types/product";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { addCartItem } = useLoggedInCart();

  const firstGeneralImage = product.images.find(
    (img) => img.sequence === 1
  )?.image;
  const secondGeneralImage = product.images.find(
    (img) => img.sequence === 2
  )?.image;

  const [hovered, setHovered] = useState(false);
  const [mainDisplayImage, setMainDisplayImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  useEffect(() => {
    let initialImage = firstGeneralImage || "/placeholder.jpg";
    let initialVariant: ProductVariant | null = null;

    if (product.variants && product.variants.length > 0) {
      const defaultSelectedVariant = product.variants.find(
        (v) => v.is_selected
      );
      if (defaultSelectedVariant && defaultSelectedVariant.images.length > 0) {
        initialImage = defaultSelectedVariant.images[0].url;
        initialVariant = defaultSelectedVariant;
      } else if (product.variants[0].images.length > 0) {
        initialImage = product.variants[0].images[0].url;
        initialVariant = product.variants[0];
      }
    }

    setMainDisplayImage(initialImage);
    setSelectedVariant(initialVariant);
  }, [product, firstGeneralImage]);

  const currentMainImageSrc =
    selectedVariant && selectedVariant.images.length > 0
      ? mainDisplayImage
      : hovered && secondGeneralImage
      ? secondGeneralImage
      : firstGeneralImage || "/placeholder.jpg";

  const handleAddToCart = async () => {
    const itemPayload = {
      id: product.id,
      name: product.name,
      quantity: 1,
      sellingPrice: parseFloat(product.sellingPrice),
      basePrice: parseFloat(product.basePrice),
      image: firstGeneralImage || "/placeholder.jpg",
      variantId: null,
      variant: null,
      product: product,
    };

    if (isLoggedIn) {
      try {
        await addCartItem(itemPayload);
        toast.success(`${product.name} added to cart!`);
      } catch (error) {
        console.error(
          "ProductCard: Failed to add item to logged-in cart:",
          error
        );
        toast.error(`Failed to add ${product.name} to cart. Please try again.`);
      }
    } else {
      dispatch(
        addToCart({
          ...itemPayload,
          cartItemId: Date.now() * -1 - Math.floor(Math.random() * 1000),
        })
      );
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div
      className="relative group shadow-md hover:shadow-xl transition-all duration-300 rounded-md p-3 overflow-hidden w-[220px] sm:w-[240px] mx-auto"
      style={{
        background: "linear-gradient(to bottom right, #dae6f1, #ffffff)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Discount Badge */}
      {product.priceDifferencePercent > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md z-10">
          {product.priceDifferencePercent}% OFF
        </div>
      )}

      {/* No Variant */}
      {!product.variants || product.variants.length === 0 ? (
        <Link href={`/product/${product.slug}`}>
          <div>
            <div className="relative w-full h-44 rounded-md overflow-hidden bg-white shadow-inner">
              <Image
                src={currentMainImageSrc}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>

            <h3 className="mt-2 text-center text-base font-semibold text-rose-800 line-clamp-2 min-h-[48px]">
              {product.name}
            </h3>

            <div className="mt-1 flex justify-center items-center gap-2">
              <span
                className="font-bold text-base"
                style={{ color: "#213E5A" }}
              >
                ₹{parseFloat(product.basePrice).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{parseFloat(product.sellingPrice).toFixed(2)}
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div>
          <div className="relative w-full h-44 rounded-md overflow-hidden bg-white shadow-inner">
            <Image
              src={currentMainImageSrc}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>

          <h3 className="mt-2 text-center text-base font-semibold text-rose-800 line-clamp-2 min-h-[48px]">
            {product.name}
          </h3>

          <div className="mt-1 flex justify-center items-center gap-2">
            <span className="font-bold text-base" style={{ color: "#213E5A" }}>
              ₹
              {selectedVariant
                ? selectedVariant.base_price.toFixed(2)
                : parseFloat(product.basePrice).toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₹
              {selectedVariant
                ? selectedVariant.selling_price.toFixed(2)
                : parseFloat(product.sellingPrice).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-2 flex justify-center">
        {product.variants && product.variants.length > 0 ? (
          <Link href={`/product/${product.slug}`} className="block">
            <button
              type="button"
              className="text-white text-sm px-4 py-1.5 rounded-full transition cursor-pointer"
              style={{ backgroundColor: "#213E5A" }}
            >
              Select Variant
            </button>
          </Link>
        ) : (
          <button
            type="button"
            className="text-white text-sm px-4 py-1.5 rounded-full transition cursor-pointer"
            style={{ backgroundColor: "#213E5A" }}
            onClick={handleAddToCart}
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
