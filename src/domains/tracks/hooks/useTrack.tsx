import { useMutation } from "@tanstack/react-query"
import { CreateTrackFormValues } from "../validations/track.schema"
import { createTrackRequest } from "../services/tracks.service"
import { queryKeys} from '@shared/constants/queryKeys'

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