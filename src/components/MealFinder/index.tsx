'use client'

import { useState, useMemo, useRef } from 'react';
import { useFormStatus } from 'react-dom';

export default function MealFinder() {
    const { pending, data } = useFormStatus();
    const [distanceValue, setDistanceValue] = useState(25);
    const [priceValue, setPriceValue] = useState(50);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const formData = {
            distance: distanceValue,
            price: priceValue,
            cuisine: Array.from(event.target.elements)
                .filter((element: any) => (element as HTMLInputElement).type === 'checkbox' && (element as HTMLInputElement).checked)
                .map(element => (element as HTMLInputElement).id.replace('cuisine-', ''))
        };
        console.log('Form Data:', formData);
    };

    return (
        <div className="max-w-2xl mx-auto mt-12">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-6 bg-gray-50 rounded-md shadow-md">
                <div className="flex flex-col">
                    <label htmlFor="distance" className="mb-2 text-gray-700 font-semibold">Distance: {distanceValue} Kilometers</label>
                    <input
                        type="range"
                        id="distance"
                        min="0"
                        max="25"
                        value={distanceValue}
                        onChange={(e) => setDistanceValue(Number(e.target.value))}
                        disabled={pending}
                        className="w-full"
                    />
                    <br></br>
                    <label htmlFor="price" className="mb-2 text-gray-700 font-semibold">Price: ${priceValue}/person</label>
                    <input
                        type="range"
                        id="price"
                        min="0"
                        max="100"
                        value={priceValue}
                        onChange={(e) => setPriceValue(Number(e.target.value))}
                        disabled={pending}
                        className="w-full"
                    />
                    <div className="mt-4">
                        <label htmlFor="cuisine" className="mb-2 text-gray-700 font-semibold">Cuisine:</label>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input type="checkbox" id="cuisine-italian" disabled={pending} className="h-4 w-4 bg-gray-300 rounded cursor-pointer accent-blue-600" />
                                <label htmlFor="cuisine-italian" className="ml-1 text-gray-700">Italian</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="cuisine-japanese" disabled={pending} className="h-4 w-4 bg-gray-300 rounded cursor-pointer accent-blue-600" />
                                <label htmlFor="cuisine-japanese" className="ml-1 text-gray-700">Japanese</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="cuisine-indian" disabled={pending} className="h-4 w-4 bg-gray-300 rounded cursor-pointer accent-blue-600" />
                                <label htmlFor="cuisine-indian" className="ml-1 text-gray-700">Indian</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="cuisine-mediterranean" disabled={pending} className="h-4 w-4 bg-gray-300 rounded cursor-pointer accent-blue-600" />
                                <label htmlFor="cuisine-mediterranean" className="ml-1 text-gray-700">Mediterranean</label>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={pending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Go!
                </button>
            </form>
        </div>
    )
}