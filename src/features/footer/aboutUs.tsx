import { Typography } from '@material-ui/core';
import React, { useRef, Suspense, useEffect, useState } from 'react';

const AboutUs:React.FC<any> = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return(
        <>
         <Typography variant="h3">
            About Us
        </Typography>
        <Typography>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Typography>
        </>
    )
}
export default AboutUs;

