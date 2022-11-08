//
//  nobounce.m
//  App
//
//  Created by Alexander Eberle on 07/11/2022.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@implementation UIScrollView (NoBounce)
- (void)didMoveToWindow {
   [super didMoveToWindow];
   self.bounces = NO;
}
@end
