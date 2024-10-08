import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { applyFilters } from '@/redux/search/searchSlice';
import CircularLoader from '../loader';
import { RootState } from '@/redux/store';

const images = [
    '/firstSlide.png',
    '/secondSlide.png',
    '/thirdSlide.png',
];

const ImageSlider = () => {
    const settings = {
        dots: true,
        // arrows: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        
    };
    const dispatch = useAppDispatch();
    
    const {status } = useAppSelector((state: RootState)=>state.products);
    const handleImageClick = () => {
        console.log(`Image clicked: `);
        dispatch(applyFilters(true));
    };
    if(status === "loading"){
        return <CircularLoader/>
    }
    return (
        <Box sx={{ width: '100%', margin: '0 auto', padding: '0', marginBottom: 2, minWidth: 0 }}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} onClick={() => handleImageClick()}>
                        {/* <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '450px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                        /> */}
                        <Box 
                            component="img"
                            src={image}
                            alt={`Slide ${index + 1}`}
                            sx={{
                                width: '100%',
                                height: { xs: '300px', md: '450px' }, // Responsive height
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </Box>
    );
};


export default ImageSlider;
