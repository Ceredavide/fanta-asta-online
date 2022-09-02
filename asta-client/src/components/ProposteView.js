function ProposteView({ proposte, highestProposta }) {
    if (proposte.length !== 0) return (
        <div className="row">
            <div className="text-center">
                Offerta piu alta: <h2>{highestProposta.value}</h2> {highestProposta.user}
            </div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome:</th>
                            <th scope="col">Valore:</th>
                            <th scope="col">Orario:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposte.map((proposta, index) => (
                            <tr key={proposta.timestamp}>
                                <th scope="row">{proposte.length-index}</th>
                                <td>{proposta.user}</td>
                                <td>{proposta.value}</td>
                                <td>{proposta.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProposteView;