
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

import vehiclesAnimation from '../../../../assets/lottie/car.json';
import electronicsAnimation from '../../../../assets/lottie/elecrtonic.json';
import watchesAnimation from '../../../../assets/lottie/watch.json';
import fashionAnimation from '../../../../assets/lottie/Fashion.json';


export default function PopularCategory() {
    const [categories, setCategories] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    async function getCategories() {
        try {
            const { data } = await axios.get(`https://lavender-eel-222276.hostingersite.com/api/categories`);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    const getCategoryAnimation = (categoryName) => {
        switch(categoryName.toLowerCase()) {
            case 'cars':
                return vehiclesAnimation;
            case 'electronics':
                return electronicsAnimation;
            case 'watches':
                return watchesAnimation;
            case 'fashion':
                return fashionAnimation;
            
        }
    };

    return (
        <div className='py-20 px-5 overflow-hidden'>
            <h2 className='mb-8 text-3xl font-bold text-center text-gray-800 dark:text-white' style={{ color: '#6C2BD9' }}>
                Shop Categories
            </h2>
            <Slider {...settings}>
                {categories.map(category => (
                    <div key={category.id} className='p-4 flex justify-center'>
                        <div className='w-64 h-80 bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col'>
                            <div className='w-full h-40 overflow-hidden flex justify-center items-center'>
                                <Lottie 
                                    animationData={getCategoryAnimation(category.name)}
                                    loop={true}
                                     className='w-48 h-48'
                                />
                            </div>
                            <div className='p-4 flex flex-col justify-between flex-1'>
                                <h4 className='text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate'>
                                    {category.name}
                                </h4>
                            
                                <Link
                                    to={`/category/${encodeURIComponent(category.name.toLowerCase())}`}
                                    className='mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-md hover:from-indigo-500 hover:to-purple-500 transition duration-300 text-sm'
                                >
                                    Explore
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
