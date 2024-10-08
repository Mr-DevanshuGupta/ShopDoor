import { Suspense, useEffect, useState } from "react";
import Footer from "../../components/LandingPage/footer";
import ProductList from "../../components/LandingPage/productList";
import CircularLoader from "../../components/loader";
import SearchAppBar from "@/components/LandingPage/search";
import Layout from "@/components/layout";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FilterTab from "@/components/LandingPage/filtertab";
import TopCategories from "@/components/LandingPage/topCategories";
import ImageSlider from "@/components/LandingPage/imageSlider";
import { useAppSelector } from "@/redux/hooks";

export default function Landing() { 
    const {filtersApplied} = useAppSelector((state) => state.search);
    const {status} = useAppSelector((state) => state.products);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [filtersApplied]);
    console.log("This is a filters applied value ", filtersApplied);
    return (
        <>
            {/* {<ImageSlider />}
            {<TopCategories/>} */}
            {!filtersApplied && <ImageSlider/>}
            {!filtersApplied && <TopCategories/>}
            <FilterTab />
            {/* <Suspense fallback={<CircularLoader />}> */}

                <ProductList/>
            {/* </Suspense> */}
        </>
    )
}