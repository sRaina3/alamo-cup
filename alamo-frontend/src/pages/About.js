import './About.css'

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header"> CUP </div>
      <div className="about-exp"> 
        <p>Alamo Cup is a weekly quick learn competition hosted every Thursday, 1 hour after COTN starts. </p>
        
        <p>Standard access users can join from the arcade searching “Alamo Cup” in rooms, and 
        Club access users can join from within the “Alamo Events” Club. </p>
        
        <span>The Current gamemode consists of the following:</span>
        <ul>
          <li>1 x 90 second warmup per map</li>
          <li>5 maps x 5 rounds</li>
          <li>30 second timeout</li>
          <li>Estimated 50 minutes runtime</li>
        </ul>
        
        <p>Points reward risking in rounds</p>
        200, 190, 180, 170, 165, 160, 155, 150, 145, 140, 136, 132, 128, 124, 120, 116, 112, 108, 
        105, 102, 99, 96, 93, 90, 87, 84, 81, 78, 75, 72, 70, 68, 66, 64, 62, 60, 58, 56, 54, 52, 
        50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 
        18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
      </div>
      
      <div className="about-header"> MAPS </div>
      <div className="about-exp">
      Alamo Cup is completely supported and reliant on the community to submit maps. Anyone is able 
      to submit a map if the following conditions are met, 30 seconds or longer, unreleased, and 
      respawnable. Above all else, make your map easy to discover. If you would like to only submit 
      a route, Rabbi can decorate it for you, and submit it to the cup. 
      
      <p> Submit maps&nbsp;
          <a href='https://docs.google.com/forms/d/e/1FAIpQLSekNARHFvg7II8Q2dtiJQImerm7FZEZQw9a_fCcVgX_8UaeyQ/viewform'
             target="_blank" rel="noopener noreferrer">
            here
          </a>
      </p>
      Your map will go into the map pool and will most likely be used in the next 2-4 weeks. Our goal 
      is to offer 5 different style maps for each cup, which could delay a map further if the style/surface 
      is abundant.
      </div>
      
      <div className="about-header"> THE ALAMO </div>
      <div className="about-exp">
      Feel free to use&nbsp;
        <a href='https://item.exchange/Set/View/11908'
            target="_blank" rel="noopener noreferrer">
          The Alamo
        </a>
        &nbsp;item in your Alamo Cup map from Item.Exchange made by The Chraz. (OPTIONAL) 
      </div>
      
      <div className="about-header"> SIGNPACKS </div>
      <div className="about-exp">
      Over time, different creators have made signs for us. Here are some links to sign images if you 
      feel so inclined to use. (OPTIONAL) 

      <p>
        <a className="centered-ref" href='https://imgur.com/a/D0H5PAy'
         target="_blank" rel="noopener noreferrer">
          Conclusion’s Tan Pack
        </a>
      </p>
      <p>
        <a className="centered-ref" href='https://imgur.com/a/gPL52Sj'
         target="_blank" rel="noopener noreferrer">
          FyredUp’s Silly Pack
        </a>
      </p>
      </div>
      
      <div className="about-header"> THANKS </div>
      <div className="about-exp">
      <p>Thanks to everyone who plays in the cup, who takes the time to make a map for the cup. 
      Thanks to all the streamers and people in chat for being a part of the event. Thanks FyredUp 
      for testing maps, Rabbi for collecting maps, Parker for recruitment, and 925 on admin. </p>
      
      <p>And of course, a huge Thanks to Saransh Raina/Hydro for creating this website. Thanks to 
      his helpers Random, and FyredUp, and thanks to MattDTO for sharing his source code for his 
      KEKL AT Hunt website.</p>
      
      Good luck hunting and see you on Thursday.
      </div>
    </div>
  )
}

export default About