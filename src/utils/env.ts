const isProd = process.env.NODE_ENV === 'production'
const isUseThrottler = () => process.env.USE_THROTTLER === '1'

export { isProd, isUseThrottler }
