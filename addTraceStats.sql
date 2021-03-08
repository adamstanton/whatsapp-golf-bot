USE [GolfDB]
GO
/****** Object:  StoredProcedure [dbo].[addTraceStats]    Script Date: 09/01/2019 05:45:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[addTraceStats]
	-- Add the parameters for the stored procedure here
	@TournamentID INT,
	@Round INT,
	@Hole INT,
	@MSTID INT,
	@ShotNumber INT,
	@ShotID INT,
	@LandingAngle REAL,
	@BallSpeed REAL,
	@FlatCarry REAL,
	@Curve REAL,
	@Height REAL,
	@HangTime REAL,
	@LaunchAngle REAL,
	@remove INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

		if (@remove = 1) 
		begin
			--select 'removing TraceStats'

			delete from dbo.TraceStats
			where TournamentID = @TournamentID
			and [Round] = @Round
			and MSTID = @MSTID
			and hole = @Hole
			and ShotNumber > @ShotNumber
		end
		ELSE
		BEGIN
			if exists(
				SELECT 1 from dbo.TraceStats where [round] = @round 
				and hole = @hole 
				and mstid = @mstid 
				and tournamentID = @tournamentID 
				and ShotNumber = @ShotNumber
				)
			BEGIN
				--select 'updating TraceStat'

				UPDATE dbo.TraceStats
				SET ShotID = @ShotID, 
				LandingAngle = @LandingAngle,
				BallSpeed = @BallSpeed, 
				FlatCarry = @FlatCarry,
				Curve = @Curve,
				Height = @Height,
				LaunchAngle = @LaunchAngle, 
				HangTime = @HangTime,
				lastUpdated = cast(SYSUTCDATETIME() as nvarchar(120)),
				remove = @remove
				where [round] = @round 
				and hole = @hole 
				and mstid = @mstid 
				and tournamentID = @tournamentID 
				and ShotNumber = @ShotNumber
			end
			else if (@ShotNumber = 0)
			begin
				--select 'deleteing traceStats'

				delete from dbo.TraceStats
				where TournamentID = @TournamentID
				and [Round] = @Round
				and MSTID = @MSTID
				and hole = @Hole
			end
			else
			begin
			if not exists(
				SELECT 1 from dbo.TraceStats where [round] = @round 
				and hole = @hole 
				and mstid = @mstid 
				and tournamentID = @tournamentID 
				and ShotNumber = @ShotNumber)
				BEGIN

				--select 'inserting TraceStat'

				INSERT INTO dbo.TraceStats (MSTID, TournamentID, [Round], Hole, ShotNumber, shotID, LandingAngle, BallSpeed, FlatCarry, curve, height, HangTime, LaunchAngle, lastUpdated, remove ) 
				VALUES (@MSTID, @TournamentID, @Round, @Hole, @ShotNumber, @ShotID, @LandingAngle, @BallSpeed, @FlatCarry, @Curve, @Height, @HangTime, @LaunchAngle, cast(SYSUTCDATETIME() as nvarchar(120)), @remove)
								
				END
			end	

			

		END

END
