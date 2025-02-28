"use client"
import * as React from "react";
import { useState } from "react";
import { CourseData } from "@/app/api/data";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const NamesList = () => {
    const [selectedButton, setSelectedButton] = useState<'mobiledevelopment' | 'webdevelopment' | 'datascience' | 'cloudcomputing' | 'all' | null>('webdevelopment');
    const mobileDevelopment = CourseData.filter((name) => name.category === 'mobiledevelopment');
    const webDevelopment = CourseData.filter((name) => name.category === 'webdevelopment');
    const dataScience = CourseData.filter((name) => name.category === 'datascience');
    const cloudComputing = CourseData.filter((name) => name.category === 'cloudcomputing');

    let selectedNames: Name[] = [];
    if (selectedButton === 'mobiledevelopment') {
        selectedNames = mobileDevelopment;
    } else if (selectedButton === 'webdevelopment') {
        selectedNames = webDevelopment;
    } else if (selectedButton === 'datascience') {
        selectedNames = dataScience;
    } else if (selectedButton === 'cloudcomputing') {
        selectedNames = cloudComputing
    }

    const nameElements = selectedNames.map((name, index) => (
        <div key={index} className="shadow-lg rounded-xl">
            <div className="text-lg sm:text-sm py-5 lg:py-0">
                <div className="overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                    <Image
                        src={name.imageSrc}
                        alt={name.course}
                        width={700}
                        height={700}
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <div className="px-2 py-6">
                    <div className='flex justify-between'>
                        <div className="block font-normal text-gray-900">
                            {name.course}
                        </div>
                        <div className="block text-lg font-semibold text-success border-solid border-2 border-success rounded-md px-1">
                            ${name.price}
                        </div>
                    </div>
                    <p aria-hidden="true" className="mt-2 mb-5 text-2xl font-semibold ">
                        {name.profession}
                    </p>
                    <div className='flex justify-between border-solid border-2 rounded-md p-2'>
                        <p>12 Classes</p>
                        <div className='flex flex-row space-x-4'>
                            <div className='flex'>
                                <Image src={'/images/courses/account.svg'} width={18} height={20} alt="circle" />
                                <p className='text-lightgrey ml-1'>120</p>
                            </div>
                            <div className='flex'>
                                <Image src={'/images/courses/Star.svg'} width={18} height={20} alt="star" />
                                <p className='ml-1'>4.5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ));


    return (
        <section>
            <div id='courses-section' className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className='sm:flex justify-between items-center pb-12'>
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 my-4">Popular Courses</h2>
                    <div>
                        <button className="bg-transparent hover:bg-primary text-primary font-medium hover:text-white py-3 px-4 border border-primary hover:border-transparent rounded duration-300">
                            Explore Classes
                        </button>
                    </div>
                </div>
                <div className='flex nowhitespace space-x-5 rounded-xl bg-white p-1 overflow-x-auto'>
                    {/* FOR DESKTOP VIEW */}
                    <button onClick={() => setSelectedButton('webdevelopment')} className={"bg-white " + (selectedButton === 'webdevelopment' ? 'text-black border-b-2 border-yellow-200' : 'text-black/40') + " pb-2 text-lg hidden sm:block"}>Web Development</button>
                    <button onClick={() => setSelectedButton('mobiledevelopment')} className={"bg-white " + (selectedButton === 'mobiledevelopment' ? 'text-black border-b-2 border-yellow-200' : 'text-black/40') + " pb-2 text-lg hidden sm:block"}>Mobile Development</button>
                    <button onClick={() => setSelectedButton('datascience')} className={"bg-white " + (selectedButton === 'datascience' ? 'text-black border-b-2 border-yellow-200' : 'text-black/40') + " pb-2 text-lg hidden sm:block"}>Data Science</button>
                    <button onClick={() => setSelectedButton('cloudcomputing')} className={"bg-white " + (selectedButton === 'cloudcomputing' ? 'text-black border-b-2 border-yellow-200' : 'text-black/40') + " pb-2 text-lg hidden sm:block"}>Cloud Computing</button>

                    {/* FOR MOBILE VIEW */}
                    <Icon
                        icon="solar:global-line-duotone"
                        onClick={() => setSelectedButton('webdevelopment')}
                        className={"text-5xl lg:hidden block " + (selectedButton === 'webdevelopment' ? 'border-b-2 border-yellow-200' : 'text-gray-400')}
                    />

                    <Icon
                        icon="solar:smartphone-line-duotone"
                        onClick={() => setSelectedButton('mobiledevelopment')}
                        className={"text-5xl lg:hidden block " + (selectedButton === 'mobiledevelopment' ? 'border-b-2 border-yellow-200' : 'text-gray-400')}
                    />

                    <Icon
                        icon="solar:database-line-duotone"
                        onClick={() => setSelectedButton('datascience')}
                        className={"text-5xl lg:hidden block " + (selectedButton === 'datascience' ? 'border-b-2 border-yellow-200' : 'text-gray-400')}
                    />

                    <Icon
                        icon="solar:cloud-line-duotone"
                        onClick={() => setSelectedButton('cloudcomputing')}
                        className={"text-5xl lg:hidden block " + (selectedButton === 'cloudcomputing' ? 'border-b-2 border-yellow-200' : 'text-gray-400')}
                    />

                </div>
                <div>
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-y-10 gap-x-8 py-12">
                            <div className="col-start-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
                                {nameElements.length > 0 ? (
                                    nameElements
                                ) : (
                                    <p>No data to show</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NamesList;




