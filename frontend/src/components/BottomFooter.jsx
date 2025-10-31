import React from 'react'

const BottomFooter = () => {
  return (

    <div className='bottom-footer bg-color-three py-8'>
      <div className='container container-lg'>
        <div className='bottom-footer__inner flex-wrap gap-16 py-16'
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span className='text-heading text-sm'>We Are Accepting</span>
            <img src='assets/images/thumbs/visa.png' alt='' />
          </div>
        </div>

        <p className='bottom-footer__text center'>
          © Copyright pandaaprint.rarenett.com  2025 . All Rights Reserved
        </p>
      </div>
    </div>


  )
}

export default BottomFooter