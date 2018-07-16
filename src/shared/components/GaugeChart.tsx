import React, {PureComponent} from 'react'
import _ from 'lodash'

import getLastValues from 'src/shared/parsing/lastValues'
import Gauge from 'src/shared/components/Gauge'

import {DEFAULT_GAUGE_COLORS} from 'src/shared/constants/thresholds'
import {stringifyColorValues} from 'src/shared/constants/colorOperations'
import {DASHBOARD_LAYOUT_ROW_HEIGHT} from 'src/shared/constants'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {DecimalPlaces} from 'src/types/dashboards'
import {TimeSeriesServerResponse} from 'src/types/series'

interface Color {
  type: string
  hex: string
  id: string
  name: string
  value: string
}

interface Props {
  data: TimeSeriesServerResponse[]
  decimalPlaces: DecimalPlaces
  cellID: string
  cellHeight?: number
  colors?: Color[]
  prefix: string
  suffix: string
  resizerTopHeight?: number
}

@ErrorHandling
class GaugeChart extends PureComponent<Props> {
  public static defaultProps: Partial<Props> = {
    colors: stringifyColorValues(DEFAULT_GAUGE_COLORS),
  }

  public render() {
    const {colors, prefix, suffix} = this.props

    return (
      <div className="single-stat">
        <Gauge
          width="900"
          colors={colors}
          height={this.height}
          prefix={prefix}
          suffix={suffix}
          gaugePosition={this.lastValueForGauge}
        />
      </div>
    )
  }

  private get height(): string {
    const {resizerTopHeight} = this.props

    return (this.initialCellHeight || resizerTopHeight || 300).toString()
  }

  private get initialCellHeight(): string {
    const {cellHeight} = this.props

    if (cellHeight) {
      return (cellHeight * DASHBOARD_LAYOUT_ROW_HEIGHT).toString()
    }

    return null
  }

  private get lastValueForGauge(): number {
    const {data, decimalPlaces} = this.props
    const {lastValues} = getLastValues(data)
    let lastValue = _.get(lastValues, 0, 0)

    if (!lastValue) {
      return 0
    }

    if (decimalPlaces.isEnforced) {
      lastValue = +lastValue.toFixed(decimalPlaces.digits)
    }

    return lastValue
  }
}

export default GaugeChart
