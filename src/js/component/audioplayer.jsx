import React, { useState, useEffect } from "react";
import { Next } from "react-bootstrap/esm/PageItem";

const AudioPlayer = () => {
	const urlAPI = "https://assets.breatheco.de/apis/sound/";
	const [list, setList] = useState([]);
	const [currentSong, setCurrentSong] = useState({});

	//Consigue las canciones de los recursos
	useEffect(() => {
		fetch(urlAPI.concat("songs"), {
			method: "GET",
			mode: "cors",
			redirect: "follow"
		})
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(responseAsJson => {
				setList(responseAsJson);
			})
			.catch(error => {
				console.log("Looks like there was a problem: \n", error);
			});
	}, []);

	//Sigue a la cancion en la que estamos actualmente
	useEffect(() => {
		if (list.length > 0) {
			setCurrentSong({ ...list[0], position: 0 });
		}
	}, [list]);

	//Reproduce la cancion anterior
	const last = () => {
		let position = currentSong.position - 1;

		if (position < 0) {
			setCurrentSong({
				...list[list.length - 1],
				position: list.length - 1
			});
		} else {
			setCurrentSong({
				...list[position],
				position: position
			});
		}
	};

	//Reproduce la siguiente cancion
	const next = () => {
		let position = currentSong.position + 1;

		if (position < list.length) {
			setCurrentSong({
				...list[position],
				position: position
			});
		} else {
			setCurrentSong({
				...list[0],
				position: 0
			});
		}
	};

	//Crea una lista con las canciones
	let playlist = list.map((song, index) => {
		return (
			<li
				className="track"
				key={index.toString()}
				onClick={() => {
					setCurrentSong({
						url: song.url,
						name: song.name,
						position: index
					});
					console.log(song.url);
				}}
				onEnded={() => {
					next();
				}}>
				{song.name}
			</li>
		);
	});

	//Pinta toda la pagina
	return (
		<div className="container justify-content-center">
			<div className="row">
				<div className="col-12">
					{" "}
					<ul className="playlist"> {playlist} </ul>
				</div>
			</div>

			<div className="row">
				<div className="player col-12 text-center">
					<figure>
						<figcaption> {currentSong.name} </figcaption>
						<audio
							src={urlAPI.concat("/", currentSong.url)}
							controls
							onEnded={() => {
								next();
							}}>
							{" "}
						</audio>
					</figure>
				</div>
			</div>

			<div className="row btn d-flex justify-content-center">
				<div className="col-2">
					<button
						onClick={() => {
							last();
						}}>
						{" "}
						<i className="fas fa-backward"></i>{" "}
					</button>
				</div>
				<div className="col-2">
					<button
						onClick={() => {
							next();
						}}>
						{" "}
						<i className="fas fa-forward"></i>{" "}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AudioPlayer;
