import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const [colorCodes, setColorCodes] = useState([]);
	const [copied, setCopied] = useState(false);

	const notify = (code) =>
		toast.success(`Color ${code} has been copied successfully`, {
			className: "notification-container",
			position: "top-center",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});

	const valueToHex = (color) => {
		return color.toString(16);
	};

	const RGBToHex = (red, green, blue) => {
		return `#${valueToHex(red)}${valueToHex(green)}${valueToHex(blue)}`;
	};

	const handleKeyDown = (event) => {
		if (event.code === "Space") {
			generateRandomColors();
		}
	};

	const generateRandomColors = async () => {
		const response = await fetch("http://colormind.io/api/", {
			method: "POST",
			mode: "cors",
			body: JSON.stringify({ model: "default" }),
		});

		const data = await response.json();
		const codes = [];

		data.result.forEach((color) => {
			codes.push(RGBToHex(...color));
		});
		setColorCodes(codes);
	};

	useEffect(() => {
		generateRandomColors();
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="App">
			<h1>Color Palette Generator</h1>
			<div className="colors-grid">
				{colorCodes.map((code, index) => {
					return (
						<CopyToClipboard
							text={code}
							key={index}
							onCopy={() => {
								setCopied({ copied: true });
								notify(code);
							}}
						>
							<div className="color-container">
								<div className="color" style={{ background: code }}></div>
								<p>{code}</p>
							</div>
						</CopyToClipboard>
					);
				})}
			</div>
			<div className="generate-container">
				<button onClick={generateRandomColors}>Generate palette</button>
				<p>Or just press the '<span>SpaceBar</span>' to generate new palettes</p>
			</div>
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	);
}

export default App;
