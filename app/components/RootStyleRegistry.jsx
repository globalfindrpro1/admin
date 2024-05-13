
'use client'
import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { legacyLogicalPropertiesTransformer, createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

const RootStyleRegistry = ({ children }) => {
  const [cache] = useState(() => createCache())

  useServerInsertedHTML(() => {
    return (
      <script
         dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    )
   })

   return <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>{children}</StyleProvider>
}

export default RootStyleRegistry;