import { useMutation } from "@tanstack/react-query"
import { CreateTrackFormValues } from "../validations/track.schema"
import { createTrackRequest } from "../services/tracks.client"
import { queryKeys} from '@/src/shared/constants/query-keys'

export const useTrack = ( setProgress: (n: number) => void,) => {
    const useCreateTrackMutation = useMutation({
        mutationFn: (data: CreateTrackFormValues) =>
          createTrackRequest(data, { onProgress: setProgress }),
        mutationKey: queryKeys.tracks.create
    })


    return {
        useCreateTrackMutation,
    }
}