import { UnityGameEmbed } from './UnityGameEmbed'

type UnityGameCardProps = {
  unityConfig?: {
    useRealBuild?: boolean
    loaderUrl?: string
    dataUrl?: string
    frameworkUrl?: string
    codeUrl?: string
  }
}

export const UnityGameCard = ({ unityConfig }: UnityGameCardProps) => {
  return (
    <section className="rounded-2xl border border-[#d8dee5] bg-white p-4 sm:p-6">
      <header className="mb-4 text-center">
        <p className="text-lg font-extrabold text-[#002244]">UNITY WEBGL</p>
      </header>

      <UnityGameEmbed {...unityConfig} />
    </section>
  )
}
