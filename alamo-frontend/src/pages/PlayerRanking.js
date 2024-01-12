import { useState } from 'react';
import './PlayerRanking.css';

const PLAYERS_PER_PAGE = 100; // Adjust this number as needed

const PlayerRanking = ({ playerList, trackCount }) => {
  const [curPage, setCurPage] = useState(1);

  const sortByAT = (a, b) => b.ATcount - a.ATcount;

  const filteredAndSortedPlayers = playerList.filter(player => player.ATcount > 0).sort(sortByAT);

  const totalPages = Math.ceil(filteredAndSortedPlayers.length / PLAYERS_PER_PAGE);
  const startIndex = (curPage - 1) * PLAYERS_PER_PAGE;
  const playersToShow = filteredAndSortedPlayers.slice(startIndex, startIndex + PLAYERS_PER_PAGE);

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  const nextPage = () => {
    if (curPage < totalPages) {
      setCurPage(curPage + 1);
    }
  };

  return (
    <div>
      <div className="header-text">
        <h1>AT Rankings</h1>
      </div>

      <div className="page-buttons-container">
        <button className="page-button" onClick={prevPage}>&#9664; Prev</button>
        <button className="page-button" onClick={nextPage}>Next {"\u25B6"}</button>
      </div>

      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>AT Count</th>
              <th>Missing</th>
            </tr>
          </thead>
          <tbody>
            {playersToShow.map((player, index) => (
              <tr key={player.id}>
                <td
                  className={`rank ${
                    (curPage === 1 && index === 0 && 'gold') ||
                    (curPage === 1 && index === 1 && 'silver') ||
                    (curPage === 1 && index === 2 && 'bronze') ||
                    ''
                  }`}
                >
                  {index + 1 + startIndex}
                </td>
                <td className="displayFont">{player._id}</td>
                <td className="displayFont">{player.ATcount}</td>
                <td className="displayFont">{trackCount - player.ATcount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="page-buttons-container">
        <button className="page-button" onClick={prevPage}>&#9664; Prev</button>
        <button className="page-button" onClick={nextPage}>Next {"\u25B6"}</button>
      </div>
    </div>
  );
};

export default PlayerRanking;