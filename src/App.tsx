import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const API_URL = "https://dog.ceo/api/breeds/image/random";

function App() {
	const initialFetchCount = 6;
	const additionalFetchCount = 3;
	const replaceInterval = 1000;

	const [imgUrls, setImgUrls] = useState<string[]>([]);
	const [fetchCount, setFetchCount] = useState(0);

	const getData = async () => {
		try {
			const res = await axios.get(API_URL);
			return res.data;
		} catch (error) {
			throw new Error("Error fetching data");
		}
	};

	useEffect(() => {
		if (fetchCount < initialFetchCount) {
			const getDataWithDelay = async () => {
				const data = await getData();
				setImgUrls((prevData) => [...prevData, data.message]);
				setFetchCount((prev) => prev + 1);
			};
			const timer = setTimeout(getDataWithDelay, replaceInterval);
			return () => clearTimeout(timer);
		}

		for (let i = 0; i < additionalFetchCount; i++) {
			if (fetchCount === initialFetchCount) {
				if (imgUrls.length >= additionalFetchCount) {
					const replaceDataWithDelay = async () => {
						const newData = await getData();
						setTimeout(() => {
							setImgUrls((prevData) => {
								const updatedData = [...prevData];
								updatedData[i] = newData.message;
								return updatedData;
							});
						}, i * replaceInterval);
					};

					replaceDataWithDelay();
				}
			}
		}
	}, [fetchCount, imgUrls.length]);

	return (
		<>
			<h1>Atarise - recruitment task</h1>
			<div style={{ maxWidth: "900px" }}>
				{imgUrls.map((imgUrl) => (
					<img
						style={{ width: "300px", height: "300px" }}
						src={imgUrl}
						key={imgUrl}
					/>
				))}
			</div>
		</>
	);
}

export default App;
