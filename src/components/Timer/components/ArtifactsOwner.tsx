interface IProps {
    img: string
    name: string
}

const ArtifactsOwner = ({name, img}: IProps) => {
    return (
        <div className="Timer__ownerBox">
            <img className="Timer__ownerImg" src={img}/>
            <span className="Timer__ownerName">{name}</span>
        </div>
    )
}

export default ArtifactsOwner