CREATE TABLE dbo.TraceStats (
		ID INT IDENTITY(1,1) PRIMARY KEY,
		TournamentID INT ,
		Round INT,
		Hole INT,
		MSTID INT,
		ShotNumber INT,
		ShotID INT,
		LandingAngle REAL,
		BallSpeed REAL,
		FlatCarry REAL,
		Curve REAL,
		Height REAL,
		HangTime REAL,
		LaunchAngle REAL,
		lastUpdated varchar(250),
		remove INT	
)