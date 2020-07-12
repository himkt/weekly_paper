import React, { Component } from 'react'
import Card from '../molecules/card'
import Form from '../molecules/form'
import LoadingContainer from '../atoms/loading'


const toJSON = (records: any) => {
  const recordsArray = records.map((r: string) => r.split('\t'))
  const [columns, ...papers] = recordsArray

  const papersJson = papers.map((paper: any) => {
    const dict: any = {}
    for (let i = 0; i < columns.length; i++) {
      const _key = columns[i].trim()
      const _paper = (paper[i] || '').trim()
      dict[_key] = _paper
    }
    return dict
  })

  papersJson.reverse()
  return papersJson
}


const parseTSV = ((response: any) => {
  let records: Array<string> = response.split('\n')
  records = records.map(
    (record) =>
    record.replace(/\n$/, '')
  )

  const papersJson = toJSON(records)
  return papersJson
})


interface State {
  data: any | null
  filt: any | null
}


class Paper extends Component<{}, State> {

  private url: string = (
    'https://docs.google.com/spreadsheets/d/e/'
    + '2PACX-1vT9wviFCRSV0iiySFWtTnmtmWp6N3QdWn4bQ-36lk7QlHc9Iz8yHfy6y2d-3F025s5NSYKPb2Hx-Xu7'
    + '/pub?output=tsv'
  )

  constructor(props: {}) {
    super(props)

    this.state = {
      data: null,
      filt: null
    }

    this.filterContentsByQuery = this.filterContentsByQuery.bind(this)
  }

  componentDidMount() {
    fetch(this.url)
    .then(response => response.text())
    .then(data => parseTSV(data))
    .then(filt =>
          this.setState({
            data: filt,
            filt: filt
          }));
  }

  filterContentsByQuery(query: string) {
    const filt = this.state.data.filter(
      (paper: any) =>
      (
        paper.Title + ' '
        + paper.Conference + ' '
        + paper.Note + ' '
        + paper.Year + ' '
        + paper.Source + ' '
        + paper.SourceShort + ' '
        + paper.Authors
      ).toLowerCase().match(query.toLowerCase())
    )
    this.setState({ filt })
  }

  render() {

    if (!this.state.filt) {
      return (
        <LoadingContainer />
      )
    }

    return (
      <div>
        <Form updateContents={this.filterContentsByQuery}/>
        <section style={{padding: 3 + 'rem'}}>
          <div className="container">
            <div className="columns">
              {this.state.filt.map((paper: any, idx: number) => (
                <Card paper={paper} idx={idx} key={idx} />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }
}


export default Paper;