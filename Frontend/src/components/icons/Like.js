import React from 'react';

const Like = ({active, size}) => {
    
    return (
        <>
            {active ? (
                <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 ldgdZj">
                    <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z" fill='#1ed760'></path>
                </svg>
            ) : (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_58_4)">
                        <path d="M4.48992 13.2069L11.9999 20.4485L19.5099 13.2069C20.8134 12.2255 21.6553 10.6695 21.6553 8.91558C21.6553 5.95475 19.2521 3.55151 16.2912 3.55151C14.5373 3.55151 12.9761 4.39926 11.9999 5.70274C11.0237 4.39926 9.46245 3.55151 7.70855 3.55151C4.74771 3.55151 2.34448 5.95475 2.34448 8.91558C2.34448 10.6695 3.18643 12.2255 4.48992 13.2069ZM7.70855 5.4826C8.79768 5.4826 9.79846 5.98468 10.4541 6.85994L11.9999 8.92379L13.5457 6.85994C14.2013 5.98468 15.2021 5.4826 16.2912 5.4826C18.1842 5.4826 19.7242 7.02263 19.7242 8.91558C19.7242 10.0037 19.2226 11.0055 18.3478 11.6645L18.2537 11.7354L18.1687 11.817L11.9999 17.7657L5.83057 11.817L5.7456 11.7354L5.65146 11.6645C4.77716 11.0055 4.27556 10.0037 4.27556 8.91558C4.27556 7.02263 5.8156 5.4826 7.70855 5.4826Z" fill='white'/>
                    </g>
                    <defs>
                        <clipPath id="clip0_58_4">
                            <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            )}
        </>
    )
}

export default Like

