USE [GolfDB]
GO
/****** Object:  StoredProcedure [dbo].[getTraceStats]    Script Date: 09/01/2019 05:43:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getTraceStats]
	-- Add the parameters for the stored procedure here
	@TournamentID INT,
	@Round INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	--SELECT * FROM Distances								
	
	SELECT S.BallSpeed, S.Curve, S.FlatCarry, S.HangTime, S.Height, S.LandingAngle, S.hole, S.[round], S.tournamentID, S.lastUpdated, P.TVNAME, S.MSTID FROM TraceStats S
	LEFT JOIN Player P ON
	P.MSTID = S.MSTID
	WHERE S.tournamentID = @TournamentID
	AND S.round = @Round
				
END
