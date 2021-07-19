//************************************************
import React from "react"
function CabecalhoTabela(){
    return(
        <thead>
            <tr>
                <th>Foto</th>
                <th>Nome do Fotógrafo</th>
                <th>Data</th>
                <th>Local</th>     
                <th></th>           
            </tr>
        </thead>
    )
}
//definicao da function q devolve o corpo (faz o mesmo que a linha 7)
const CorpoTabela = (props)=>{

    async function removerFotos(foto) {

        let resposta = await fetch("Api/FotografiasAPI/" + foto.idFoto, {
          method: "DELETE",
          body: {id: foto.idFoto}
        });

        if (!resposta.ok) {
            // não obtivemos o 'código de erro' HTTP 200
            console.error(resposta);
            throw new Error('não foi possível enviar os dados da nova foto. Código= ' + resposta.status);
        }
        window.location.reload();

        return await resposta.json();
    }

    const rows = props.dadosDasFotos.map((row) => {
        return(
            <tr key={row.idFoto}>
                <td><img src={'fotos/' + row.foto} alt={"Foto de " + row.localFoto} height="50"/></td>
                <td>{row.nomeFotografo}</td>
                <td>{row.dataFoto}</td>
                <td>{row.localFoto}</td>
                <td>
                    <button className="btn btn-outline-danger" onClick={() => removerFotos(row)}>Apagar Foto</button>
                </td>
            </tr>
        )
    })
    return(
        <tbody>
            {rows}
        </tbody>
    )
}

//componente que junta os 2 componenetes
class Tabela extends React.Component{
    render(){
        const {inDadosFotos}=this.props
        return(
            <table className="table table-striped table-success">
                <CabecalhoTabela /> 
                <CorpoTabela dadosDasFotos={inDadosFotos}/>
            </table>
        )
    }
}
export default Tabela