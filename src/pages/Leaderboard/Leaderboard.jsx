import React from "react";
import { Box, Typography, Card, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import rank1 from "../../assets/images/rank1.svg";
import rank2 from "../../assets/images/rank2.svg";
import rank3 from "../../assets/images/rank3.svg";
import background1 from "../../assets/images/background1.svg";
import background2 from "../../assets/images/background2.svg";
import background3 from "../../assets/images/background3.svg";

const leaderboardData = [
	{
		teamName: "Visual Voyagers",
		points: 510,
		memors: 51,
		rank: 1,
		avatar: "src/assets/images/team1logo.png",
	},
	{
		teamName: "The Debuggers",
		points: 360,
		memors: 36,
		rank: 2,
		avatar: "src/assets/images/team2logo.png",
	},
	{
		teamName: "Capital Crew",
		points: 190,
		memors: 19,
		rank: 3,
		avatar: "src/assets/images/team3logo.png",
	},
	{
		teamName: "The Hackers",
		points: 150,
		memors: 15,
		rank: 4,
		avatar: "src/assets/images/goat.png",
	},
	{
		teamName: "The Coders",
		points: 120,
		memors: 12,
		rank: 5,
		avatar: "src/assets/images/goat.png",
	},
	{
		teamName: "The Programmers",
		points: 100,
		memors: 10,
		rank: 6,
		avatar: "src/assets/images/goat.png",
	},
	{
		teamName: "The Developers",
		points: 90,
		memors: 9,
		rank: 7,
		avatar: "src/assets/images/goat.png",
	},
	{
		teamName: "The Designers",
		points: 80,
		memors: 8,
		rank: 8,
		avatar: "src/assets/images/goat.png",
	},
	{
		teamName: "The Creators",
		points: 70,
		memors: 7,
		rank: 9,
		avatar: "src/assets/images/goat.png",
	},
	{
		teamName: "The Innovators",
		points: 60,
		memors: 6,
		rank: 10,
		avatar: "src/assets/images/goat.png",
	},
];

const Leaderboard = () => {
	return (
		<div className="container">
			<img
				src={background1}
				alt="leaderboard-bg1"
				style={{
					position: "absolute",
					top: "2",
					right: "0",
					width: "15%",
					zIndex: "0",
				}}
			/>
			<img
				src={background2}
				alt="leaderboard-bg2"
				style={{
					position: "absolute",
					top: "25%",
					left: "5%",
					width: "5%",
					zIndex: "0",
				}}
			/>
			<img
				src={background3}
				alt="leaderboard-bg3"
				style={{
					position: "absolute",
					top: "35%",
					right: "6%",
					width: "5%",
					zIndex: "0",
				}}
			/>
			<Box
				sx={{
					padding: "20px",
					minHeight: "100vh",
					paddingBottom: "40px",
					zIndex: "10",
				}}
			>
				{/* Header */}
				<Typography
					variant="h1"
					sx={{
						fontWeight: "bold",
						color: "white",
						marginBottom: "30px",
					}}
				>
					Leaderboard
				</Typography>

				{/* Top 3  */}
				<Grid
					container
					spacing={3}
					sx={{
						justifyContent: "center",
						marginBottom: "40px",
						alignItems: "end",
					}}
				>
					<Grid sx={{ width: "calc(30% - 20px)", maxWidth: "400px" }} xs={12} sm={4}>
						<Card
							sx={{
								backgroundColor: "#381e72",
								borderRadius: "20px",
								textAlign: "center",
								color: "white",
								padding: "20px",
								position: "relative",
								height: "15rem",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "start",
									gap: "10px",
									position: "absolute",
									top: "15px",
									left: "15px",
								}}
							>
								<Avatar
									src={leaderboardData[1].avatar}
									alt={leaderboardData[1].teamName}
									sx={{
										width: "40px",
										height: "40px",
										border: "2px solid white",
									}}
								/>
								<Typography
									variant="h6"
									sx={{
										color: "#D0BCFE",
									}}
								>
									{leaderboardData[1].teamName}
								</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
								}}
							>
								<Typography
									variant="h4"
									sx={{ fontWeight: "bold" }}
								>
									{leaderboardData[1].points} Points
								</Typography>
								<Typography
									variant="body1"
									sx={{
										marginTop: "5px",
										fontSize: "1.2rem",
									}}
								>
									{leaderboardData[1].memors} Memors
								</Typography>
							</Box>
							<img
								src={rank2}
								alt="rank"
								style={{
									position: "absolute",
									bottom: "0px",
									right: "10px",
									height: "45%",
								}}
							/>
						</Card>
					</Grid>

					<Grid sx={{ width: "calc(38% - 20px)", maxWidth: "500px" }} xs={12} sm={4}>
						<Card
							sx={{
								backgroundColor: "#d0bcfe",
								borderRadius: "20px",
								textAlign: "center",
								color: "white",
								padding: "20px",
								position: "relative",
								height: "20rem",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "start",
									gap: "10px",
									position: "absolute",
									top: "15px",
									left: "15px",
								}}
							>
								<Avatar
									src={leaderboardData[0].avatar}
									alt={leaderboardData[0].teamName}
									sx={{
										width: "40px",
										height: "40px",
										border: "2px solid white",
									}}
								/>
								<Typography
									variant="h6"
									sx={{
										color: "#381e72",
									}}
								>
									{leaderboardData[0].teamName}
								</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
								}}
							>
								<Typography
									variant="h4"
									sx={{
										color: "#381e72",
										fontWeight: "bold",
										fontSize: "3rem",
									}}
								>
									{leaderboardData[0].points} Points
								</Typography>
								<Typography
									variant="body1"
									sx={{
										marginTop: "5px",
										color: "#381e72",
										fontSize: "1.4rem",
									}}
								>
									{leaderboardData[0].memors} Memors
								</Typography>
							</Box>
							<img
								src={rank1}
								alt="rank"
								style={{
									position: "absolute",
									bottom: "0px",
									right: "10px",
									height: "75%",
								}}
							/>
						</Card>
					</Grid>

					<Grid sx={{ width: "calc(30% - 20px)", maxWidth: "350px" }} xs={12} sm={4}>
						<Card
							sx={{
								backgroundColor: "#232627",
								borderRadius: "20px",
								textAlign: "center",
								color: "white",
								padding: "20px",
								position: "relative",
								height: "12rem",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "start",
									gap: "10px",
									position: "absolute",
									top: "15px",
									left: "15px",
								}}
							>
								<Avatar
									src={leaderboardData[2].avatar}
									alt={leaderboardData[2].teamName}
									sx={{
										width: "40px",
										height: "40px",
										border: "2px solid white",
									}}
								/>
								<Typography
									variant="h6"
									sx={{
										color: "#D0BCFE",
									}}
								>
									{leaderboardData[2].teamName}
								</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
								}}
							>
								<Typography
									variant="h4"
									sx={{
										fontWeight: "bold",
										fontSize: "1.8rem",
									}}
								>
									{leaderboardData[2].points} Points
								</Typography>
								<Typography
									variant="body1"
									sx={{ marginTop: "5px" }}
								>
									{leaderboardData[2].memors} Memors
								</Typography>
							</Box>
							<img
								src={rank3}
								alt="rank"
								style={{
									position: "absolute",
									bottom: "0px",
									right: "0px",
									height: "35%",
									zIndex: "10",
								}}
							/>
						</Card>
					</Grid>
				</Grid>

				{/* Global Ranking */}
				<Typography
					variant="h5"
					sx={{
						color: "white",
						marginBottom: "20px",
						marginTop: "50px",
					}}
				>
					Global Ranking
				</Typography>

				<Box sx={{ width: "100%", marginBottom: "20px" }}>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr 1fr",
							textAlign: "center",
							gap: "10px",
							borderRadius: "13.576px",
							border: "2.715px solid #333738",
							padding: "10px",
							background: "#232627",
							marginBottom: "20px",
						}}
					>
						<Typography
							variant="h6"
							sx={{
								color: "white",
							}}
						>
							Rank
						</Typography>
						<Typography
							variant="h6"
							sx={{
								color: "white",
								textAlign: "center",
							}}
						>
							Team
						</Typography>
						<Typography
							variant="h6"
							sx={{
								color: "white",
							}}
						>
							Memors Completed
						</Typography>
						<Typography
							variant="h6"
							sx={{
								color: "white",
							}}
						>
							Total Points
						</Typography>
					</Box>
					{leaderboardData
						.filter((team) => team.rank >= 4)
						.map((team) => (
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr 1fr",
									alignItems: "center",
									textAlign: "center",
									borderRadius: "13.576px",
									border: "2.715px solid #333738",
									padding: "10px",
									marginTop: "-2px",
								}}
							>
								<Typography
									variant="h6"
									sx={{
										color: "white",
										textAlign: "center",
									}}
								>
									{team.rank}
								</Typography>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "left",
										gap: "10px",
									}}
								>
									<Avatar
										src={team.avatar}
										alt={team.teamName}
										sx={{
											width: "30px",
											height: "30px",
											border: "2px solid white",
										}}
									/>
									<Typography
										variant="h6"
										sx={{
											color: "white",
											textAlign: "center",
										}}
									>
										{team.teamName}
									</Typography>
								</Box>
								<Typography
									variant="h6"
									sx={{
										color: "white",
										textAlign: "center",
									}}
								>
									{team.memors}
								</Typography>
								<Typography
									variant="h6"
									sx={{
										color: "white",
										textAlign: "center",
									}}
								>
									{team.points}
								</Typography>
							</Box>
						))}
				</Box>
			</Box>
		</div>
	);
};

export default Leaderboard;
