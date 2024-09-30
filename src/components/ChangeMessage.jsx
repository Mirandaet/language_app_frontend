import React from 'react'

function ChangeMessage({conversationHistory, message, index}) {
    function handleChange(){
        conversationHistory.length = index + 1
    } 


  return (
    <div>
        <button onClick={handleChange}>Change</button>
    </div>
  )
}

export default ChangeMessage