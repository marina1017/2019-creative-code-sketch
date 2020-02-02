//
//  File.swift
//  09-ARtest
//
//  Created by 中川万莉奈 on 2020/01/26.
//  Copyright © 2020 中川万莉奈. All rights reserved.
//

import ARKit

extension ARCamera.TrackingState {
    public var description: String {
        switch self {
        case .notAvailable:
            return "TRACKING UNAVAILABLE"
        case .normal:
            return "TRACKING NORMAL"
        case .limited(let reason):
            switch reason {
            case .excessiveMotion:
                return "TRACKING LIMITED\nToo much camera movement"
            case .insufficientFeatures:
                return "TRACKING LIMITED\nNot enough surface detail"
            case .initializing:
                return "Tracking LIMITED\nInitialization in progress."
            case .relocalizing:
                return "Tracking LIMITED\nRelocalizing."
            @unknown default:
                fatalError()
            }
        }
    }
}
