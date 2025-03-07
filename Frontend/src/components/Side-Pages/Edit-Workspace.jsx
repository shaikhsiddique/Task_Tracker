import React from 'react'

function Edit_Workspace({setshowEditWorkspace}) {
  return (
    <div className="h-full w-full bg-[#FFFFFF] flex items-center justify-center overflow-y-auto ">
    <div className="w-full h-auto p-20">
      
      <div onClick={()=>setshowEditWorkspace(false)} className='flex items-center justify-center'>
      <i className="ri-arrow-down-wide-fill text-4xl"></i>
      </div>
      {/* Form Section */}
      <div className="container mx-auto max-w-lg p-8 rounded-lg shadow-lg">
      <div className="pb-6">
        <h1 className="text-4xl font-bold text-center mb-4">Edit Workspace</h1>
      </div>
        <form action="" className="space-y-6">
          <input
            type="text"
            placeholder="Workspace Name"
            className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="w-full p-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Edit_Workspace