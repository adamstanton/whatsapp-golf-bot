USE [GolfDB]
GO
/****** Object:  StoredProcedure [dbo].[getTraceStatsUpdates]    Script Date: 09/01/2019 05:45:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getTraceStatsUpdates]

@round as int,
@tournamentID as int,
@updatedTime as varchar(120)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT s.ID, s.BallSpeed, s.Curve, s.FlatCarry, s.HangTime, s.[round], s.Height, s.[Hole], s.lastUpdated, s.LandingAngle, s.MSTID FROM TraceStats s
	WHERE s.tournamentID = @tournamentID and s.[round] = @round and s.lastUpdated >= @updatedTime
	order by s.lastupdated

END