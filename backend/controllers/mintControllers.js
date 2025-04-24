import {Web3Storage, File} from 'web3.storage'

function getAccesToken(){
    return process.env.WEB3_STORAGE_TOKEN
}

function makeStorageClient(){
    return new Web3Storage({ token: getAccessToken()})
}

async function storeCertificateMetadata(certificateData){
    const json=JSON.stringify(certificateData)
    const blob=new Blob([json], {type: 'application/json'})
    const file=new File([blob], 'certificate_1.json')

    const client=makeStorageClient()
    const cid=await client.put([file])
    return `ipfs://${cid}/certificate_1.json`
}

export const handleEligibilityAndMint=async (studentId)=>{
    const metadata={
        name:"Degree Completion Certificate",
        description: "Issued on achieving 180+ credits",
        studentName: studentId.name,
        // image: "ipfs://<optional_certificate_image_cid>",
    }

    const uri=await storeMetadataONIPFS(metadata)
    const soulId=1
    await contract.methods.mintwithURI(studentId.walletAddress, soulId,  uri)
    .send({from:process.env.ADMIN_WALLET})

    studentId.certificateMinted==true
    await student.save()

    return {success:true,uri}

    return { success: false, message: "Not eligible or already minted." }
}

await contract.methods.mintWithURI(studentAddress, soulId, ipfsURI).send({ from: adminWallet })
